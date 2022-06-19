import http from 'http';
import dotenv from 'dotenv';
import {IUser} from './utils/types';
import {users, get_users, get_user, add_user} from "./src/users";
import {API_URL} from "./utils/constants";
import {v4 as uuid, validate} from 'uuid';
import {isUser} from "./utils/check";

dotenv.config();

const port: string = process.env.PORT || '8000';

const server = http.createServer(async (request, response) => {
    try {
        switch (request.method) {
            case 'GET':
                if (request.url === API_URL) {
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(`<h1>${get_users()}</h1>`);
                } else if (request.url?.startsWith(API_URL)) {
                    const id = request.url.split("/")[3];
                    if (validate(id)) {
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        const user = get_user(id);
                        if (user) {
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.end(user);
                        } else {
                            response.writeHead(404, {'Content-Type': 'application/json'});
                            response.end(`User ID: ${id} doesn't exist`);
                        }
                    } else {
                        response.writeHead(400, {'Content-Type': 'text/html'});
                        response.end(`ID: ${id} is not valid`);
                    }
                } else {
                    response.writeHead(404, {'Content-Type': 'application/json'});
                    response.end(`URL doesn't exist`);
                }
                break;
            case 'POST':
                if (request.url?.startsWith(API_URL)) {
                    let body = '';
                    request.on('data', chunk => {
                        body += chunk.toString();
                    });
                    if(body) {
                        const user: IUser = JSON.parse(body);
                        if (isUser(user)) {
                            const {username, age, hobbies} = user;
                            const id = uuid();
                            add_user({id, username, age, hobbies});
                            response.writeHead(201, 'application/json')
                            response.end(
                                JSON.stringify({
                                    message: 'user was added',
                                    user: {id, username, age, hobbies},
                                })
                            );
                        } else {
                            response.writeHead(400, {'Content-Type': 'text/html'});
                            response.end(`body does not contain required fields`);
                        }
                    }
                    else {
                        response.writeHead(400, {'Content-Type': 'text/html'});
                        response.end(`body does not contain required fields`);
                    }

                } else {
                    response.writeHead(404, {'Content-Type': 'application/json'});
                    response.end(`URL doesn't exist`);
                }
            case 'PUT':
                if (request.url?.startsWith(API_URL)) {
                    const id = request.url?.split("/")[3];
                    if (validate(id)) {
                        if (get_user(id)){

                        } else {
                            response.writeHead(404, {'Content-Type': 'application/json'});
                            response.end(`User ID: ${id} doesn't exist`);
                        }
                    } else {
                        response.writeHead(400, {'Content-Type': 'text/html'});
                        response.end(`ID: ${id} is not valid`);
                    }
                } else {
                    response.writeHead(404, {'Content-Type': 'application/json'});
                    response.end(`URL doesn't exist`);
                }
        }
    } catch (e) {

    }
})

server.listen(port, () => console.log(`server 1 2 3 4 5 started on port ${port}`));
