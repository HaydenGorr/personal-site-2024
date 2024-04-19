const Article = require('../../mongo_schemas/article_schema.js');
const { dbConnect } = require('../db_conn')
async function is_this_article_already_published(article_folder_name){

    const connection = await dbConnect(process.env.DB_ARTICLES_NAME)

    try {
        const articles = await Article(connection).find({source: article_folder_name});

        if(articles.length === 0) return false

        return articles
    } catch (error) {
        console.error('Error:', error);
        return false
    }
}

module.exports = {
    is_this_article_already_published
};
