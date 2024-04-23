// delete_article.js
const ArticleModel = require('../../mongo_schemas/article_schema');  // Adjust the path to where your Mongoose model is defined
const { dbConnect }  = require('../db_conn');

async function deleteArticle(articleId) {
    try {
      const connection = await dbConnect(process.env.DB_ARTICLES_NAME);
      console.log("AH!")
      const Article = await ArticleModel(connection); // If your model needs a connection to initialize
      console.log("\ndeleting")
      const result = await Article.findByIdAndDelete(articleId);
      console.log("\ndeleted")
      if (!result) {
        return { success: false, message: "Article not found" };
      }
      return { success: true, message: "Article deleted successfully" };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      if (connection) {
        connection.close(); // Close the connection when done
      }
    }
  }

module.exports = {
    deleteArticle
};
