const Article = require('../../mongo_schemas/article_schema.js');
const { dbConnect } = require('../db_conn')
const { MONOGDB_CHIPS } = require('../path_consts.js')


async function add_article(source_folder){

    console.log("creating chip")

    const connection = await dbConnect(process.env.DB_ARTICLES_NAME)
  
    try {
        const ArticleModel = Article(connection);

        const newArticle = new ArticleModel({
            title: "template title",
            desc: "template definition",
            infoText: "template infoText",
            chips: [],
            source: generateRandomString(8),
            views: 0,
            publishDate: new Date(),
            ready: false,
            portfolioReady: false
        });

        const asd = await newArticle.save();

        return asd;
    } catch (error) {
        console.error('Error:', error);
    }

}

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    add_article
};
