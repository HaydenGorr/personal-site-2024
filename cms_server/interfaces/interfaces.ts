import { Types } from "mongoose";

export interface category {
    _id?: Types.ObjectId;
    name: string;
    submit_date: Date|string;
}

export interface chip {
    _id?: Types.ObjectId;
    name: string;
    description: string;
    submit_date: Date|string;
}

export interface article {
    _id?: number;
    title: string,
    description: string,
    category: string,
    infoText: string,
    chips: string[],
    views: Number,
    publishDate: Date,
    ready: Boolean,
    portfolioReady: Boolean,
    type: string,
    image: string,
    article: string,
}

export interface file_on_drive {
    file_name: string;
    full_url: string;
    upload_date?: string|Date;
}

export interface image extends file_on_drive {
    _id?: Types.ObjectId;
    category: string;
}

export interface mdx extends file_on_drive {
    _id?: number;
}

export interface api_return_schema<T> {
    data: T
    error: error
}

export interface error {
    has_error: Boolean,
    error_message: string,
}

export interface user {
    _id?: number;
    username: string;
    password: string;
}

import { JwtPayload } from "jsonwebtoken";
export interface userId_JWTPayload extends JwtPayload {
    userId: string;
}

export enum AI_type_enum {
    chat_bot,
    tag_finder,
}