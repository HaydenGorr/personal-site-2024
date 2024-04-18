const mongoose = require('mongoose');
const { MONOGDB_ARTICLES } = require('../path_consts')
const { Article } = require('../../mongo_schemas/article_schema')

async function get_article(article_dir_name){
    try {
        await mongoose.connect(MONOGDB_ARTICLES);
        const article = await Article.find({source: article_dir_name});
        return article
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    } finally {
        await mongoose.connection.close();
    }
}

async function get_all_articles(){
    try {
        await mongoose.connect(MONOGDB_ARTICLES);
        const articles = await Article.find();
        return articles
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    } finally {
        await mongoose.connection.close();
    }
}


module.exports = {
    get_article,
    get_all_articles
};
