import { Types } from "mongoose";

export interface category {
    name: string;
    submit_date?: Date | NativeDate | string;
}

export interface db_category extends category {
    _id: string | Types.ObjectId;
}