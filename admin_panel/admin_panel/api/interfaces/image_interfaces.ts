import { file_on_drive } from "./misc_interfaces";
import { image_type_enum } from "./enums";

export interface image extends file_on_drive {
    category: image_type_enum;
}

export interface db_image extends image {
    _id: string,
}