import { file_on_drive } from "./misc_interfaces.js";
import { image_type_enum } from "./enums.js";
import { Types } from "mongoose";

export interface image extends file_on_drive {
    category: image_type_enum | string;
}

export interface db_image extends image {
    _id: Types.ObjectId | string,
}