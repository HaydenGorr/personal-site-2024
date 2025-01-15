import { file_on_drive } from "./misc_interfaces.js";
import { db_image } from "./image_interfaces.js";
import { Types } from "mongoose";

export interface mdx_WID extends file_on_drive {
    images: string;
    snippet: string;
    edit_date: Date|string;
    version_history?: string[] | number[];
    title: string;
}

export interface db_mdx extends Omit<mdx_WID, 'images'> {
    _id: Types.ObjectId | string,
    images: db_image[],
}