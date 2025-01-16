import { db_image } from "./image_interfaces.js";
import { db_mdx } from "./mdx_interfaces.js";
import { Types } from "mongoose";

/**
 * WID - With IDS. This means that the object contains database IDs in place
 * of the actual data wheverer applicable.
 * 
 * For this object image and mdx will be string IDs. in db_article, those props
 * will instead by fully populated mdx and image objects from the DB
 */
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

export interface db_article extends Omit<article_WID, '_id' | 'mdx' | 'image'> {
    _id: Types.ObjectId | string,
    image: db_image,
    mdx: db_mdx,
}
