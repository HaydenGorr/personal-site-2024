import { Types } from "mongoose";

export interface dbuser {
    _id?: Types.ObjectId | string | number;
    username: string;
    password: string;
}