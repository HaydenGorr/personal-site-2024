const Article = require('../../mongo_schemas/article_schema.js');
const { dbConnect } = require('../db_conn')
async function get_article(article_dir_name){

    const connection = await dbConnect(process.env.DB_ARTICLES_NAME)

    try {
        const article = await Article(connection).find({source: article_dir_name});
        return article
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    }
}

async function get_all_articles(){
    const connection = await dbConnect(process.env.DB_ARTICLES_NAME)
    try {
        const articles = await Article(connection).find();
        return articles
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    }
}


module.exports = {
    get_article,
    get_all_articles
};
