import {IUser} from "../utils/types";

export let users: Array<IUser> = [];

export const get_users = ():Array<IUser> | void => {
    return users;
}

export const get_user = (id:string): IUser | void => {
    return users.find(user => user.id===id);
}

export const add_user = (user:IUser):void => {
    users.push(user);
}

export const update_user = (user:IUser):void => {
    users.map((item, index) => {
        if (item.id === user.id) {
            users[index] = user;
        }
    })
}

export const delete_user = (id:string) => {
    users = users.filter(item => item.id!==id);
}
