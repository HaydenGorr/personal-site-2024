import { db_mdx } from './mdx_interfaces';
import { db_image } from './image_interfaces';
/**
 * WID - With IDS. This means that the object contains database IDs in place
 * of the actual data wheverer applicable.
 * 
 * For this object image and mdx will be string IDs. in db_article, those props
 * will instead by fully populated mdx and image objects from the DB
 */
export interface article_WID {
    _id: string;
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
    image: string;
    mdx: string;
}

export interface db_article extends Omit<article_WID, 'mdx' | 'image'> {
    _id: string,
    image: db_image,
    mdx: db_mdx,
}
