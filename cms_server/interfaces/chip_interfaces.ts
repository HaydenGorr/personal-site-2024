import { Types } from "mongoose";

export interface chip {
    name: string;
    description: string;
    submit_date?: string | NativeDate;
}

export interface db_chip extends chip {
    _id: string | Types.ObjectId;
}