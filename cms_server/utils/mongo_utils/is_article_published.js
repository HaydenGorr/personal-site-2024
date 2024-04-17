const { Article } = require('../../mongo_schemas/article_schema')
const { MONOGDB_ARTICLES } = require('../path_consts')
const mongoose = require('mongoose')

async function is_this_article_already_published(article_folder_name){
    try {
        await mongoose.connect(MONOGDB_ARTICLES);
        const articles = await Article.find({source: article_folder_name});

        if(articles.length === 0) return false

        return articles
    } catch (error) {
        console.error('Error:', error);
        return false
    } finally {
        await mongoose.connection.close();
    }
}

module.exports = {
    is_this_article_already_published
};
