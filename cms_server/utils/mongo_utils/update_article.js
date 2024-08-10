const Article = require('../../mongo_schemas/article_schema.js');
const { dbConnect } = require('../db_conn')

const updatedArticle = async({ databaseID, title, desc, infoText, chips, source, views, publishDate, ready, portfolioReady}) => {
    const connection = await dbConnect(process.env.DB_ARTICLES_NAME)

    try {
        const articleModel = await Article(connection)

        const updated_article = await articleModel.findByIdAndUpdate(
            databaseID, // the _id of the document to update
            { $set: { title: title, desc: desc, infoText: infoText, chips: chips, source: source, views: views, publishDate: publishDate, ready: ready, portfolioReady: true } }, // the update operations
            { new: true } // return the updated document
        );

        console.log("updated, ", updated_article)

        return updated_article;
    }
    catch {
        console.log("tractor")
        console.error('Error:', error);
        return 'Internal server error';
    }
}

module.exports = {
    updatedArticle
};
