import { api_return_schema, article } from "../../interfaces/interfaces";
import * as fs from 'fs'
import * as path from 'path'
const Article = require('../../mongo_schemas/article_schema.js');
const { dbConnect } = require('../db_conn')
const { articles_dir } = require('../path_consts');

// async function get_article(article_dir_name){

//     const connection = await dbConnect(process.env.DB_ARTICLES_NAME)

//     try {
//         const article = await Article(connection).find({source: article_dir_name});
//         return article
//     } catch (error) {
//         console.error('Error:', error);
//         return 'Internal server error'
//     }
// }

async function get_all_articles(): Promise<api_return_schema<article[]>>{
    try {
        const connection = await dbConnect(process.env.DB_ARTICLES_NAME)
        const articles: any[] = await Article(connection).find().sort({ publishDate: -1 });
        return {data: articles, error:{has_error: false, error_message: ""}}
    } catch (error) {
        console.error('Error:', error);
        return {data: [], error:{has_error: true, error_message: `${error}`}}
    }
}

function hasContainerPng(source: string): boolean {
    const fullUrl = path.join(articles_dir, source);
    const files = fs.readdirSync(fullUrl);
    console.log(files)
    return files.includes('container.png');
}

module.exports = {
    // get_article,
    get_all_articles,
    hasContainerPng
};
