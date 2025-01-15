import { Types } from "mongoose";

export type db_obj<T> = T & { _id: Types.ObjectId | number | string };

export interface category {
    _id?: Types.ObjectId | string | number;
    name: string;
    submit_date: Date|string;
}

export interface chip {
    _id?: Types.ObjectId | string | number;
    name: string;
    description: string;
    submit_date: Date|string;
}

export interface article<Timage=image, Tmdx=mdx> {
    title: string,
    description: string,
    category: string,
    infoText?: string,
    chips: string[],
    views: Number,
    publishDate: Date,
    ready: Boolean,
    portfolioReady: Boolean,
    type: string,
    image: Timage,
    mdx: Tmdx,
}

// An article object where the image, and mdx are just string IDs rather
// than fully populate DB objects
export interface article_WID {
    _id: string | Types.ObjectId;
    title: string;
    description: string;
    type: string;
    infoText: string;
    chips: string[];
    category: string;
    views: 0;
    publishDate: Date;
    ready: boolean;
    portfolioReady: boolean;
    image: string | Types.ObjectId;
    mdx: string | Types.ObjectId;
}

export interface file_on_drive {
    file_name: string;
    full_url: string;
    upload_date: string|Date;
}


export enum image_type_enum {
    container="container",
    in_article="in_article",
}

export interface image extends file_on_drive {
    category: image_type_enum;
}

export interface db_image extends image {
    _id: string,
}

export interface mdx extends file_on_drive {
    images: image[] | any[];
    snippet: string;
    edit_date: Date|string;
    title: string;
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
    _id?: Types.ObjectId | string | number;
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