export interface category {
    _id?: number;
    name: string;
}

export interface chip {
    _id?: number;
    name: string;
    description: string;
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
}

export interface mdx_on_drive extends file_on_drive{
    _id?: number;
}

export interface image_on_drive extends file_on_drive{
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

export interface image {
    _id?: number;
    file_name: string;
}

export interface mdx {
    _id?: number;
    file_name: string;
}

import { JwtPayload } from "jsonwebtoken";
export interface userId_JWTPayload extends JwtPayload {
    userId: string;
}