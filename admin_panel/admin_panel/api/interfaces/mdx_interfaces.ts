import { file_on_drive } from "./misc_interfaces";
import { image_type_enum } from "./enums";
import { db_image } from "./image_interfaces";

export interface mdx_WID extends file_on_drive {
    images: string[];
    snippet: string;
    edit_date: Date|string;
    version_history: string[] | number[];
    title: string;
}

export interface db_mdx extends Omit<mdx_WID, 'images'> {
    _id: string,
    images: db_image[],
}