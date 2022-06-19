import {IUser} from "./types";

export function isUser(obj: any): obj is IUser {
    return "username" in obj && "age" in obj && "hobbies" in obj;
}
