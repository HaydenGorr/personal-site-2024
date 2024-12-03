import { Types } from "mongoose";

export interface category {
    _id?: Types.ObjectId;
    name: string;
    submit_date: Date;
}

export interface chip {
    _id?: Types.ObjectId;
    name: string;
    description: string;
    submit_date: Date;
}

export interface article {
    _id?: number;
    title: string;
    desc: string;
    infoText: string;
    chips: chip[],
    category: string,
    source: string;
    views: number;
    publishDate: Date,
    ready: Boolean,
    portfolioReady: Boolean,
    hasImage: Boolean,
    image: string
}

export interface file_on_drive {
    file_name: string;
    full_url: string;
    upload_date: string;
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