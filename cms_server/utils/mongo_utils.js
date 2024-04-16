const { Article } = require('../mongo_schemas/article_schema.js');
const { Chip } = require('../mongo_schemas/chip_schema.js');
const { MONOGDB_ARTICLES, MONOGDB_CHIPS, articles_dir } = require('./path_consts.js');
const path = require('path');
const { validate_article_before_publishing } = require('./validate_before_publishing.js')
const { readJSON } = require('./misc_utils.js')
const mongoose = require('mongoose');
const { add_chip } = require('../utils/mongo_utils/add_chip.js')
const { get_definitions_for_new_chips } = require('./validate_chips.js')

async function get_unique_chips(){
    try {
        await mongoose.connect(MONOGDB_CHIPS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const chips = await Chip.find();
        return chips
    } catch (error) {
        console.error('Error:', error);
        return false
    } finally {
        await mongoose.connection.close();
    }
}

async function get_all_ready_articles(){
    try {
        // Connect to the MongoDB database
        await mongoose.connect(MONOGDB_ARTICLES);
    
        // Find all articles in the database
        const articles = await Article.find({ ready: true });
    
        // Send the articles as the response
        return articles
      } catch (error) {
        console.error('Error:', error);
        return {error: error}
      } finally {
        // Close the database connection
        await mongoose.connection.close();
      }
}

/**
 * Takes a new article in cms_data, validates it and adds it to the database
 * @param {String} article_dir_name - The name of the dir containing the article you're creating
 */
async function create_article({article}){

    const article_dir_name = article

    console.log("creating article: ", article)

    const new_article_path = path.join(articles_dir, article_dir_name);

    if(!await validate_article_before_publishing(new_article_path, article_dir_name)) return false

    const article_meta = await readJSON(path.join(new_article_path, "meta.json"))

    await mongoose.connect(MONOGDB_ARTICLES)
    .then(() => {
        
        // Create a new document
        const newArticle = new Article({
        title: article_meta.title,
        desc: article_meta.desc,
        infoText: article_meta.infoText,
        chips: article_meta.chips,
        source: article_dir_name,
        views: 0,
        publishDate: Date.now(),
        ready: true
        });
        
        // Save the document
        return newArticle.save();
    })
    .then(() => {
        console.log('Document inserted successfully');
        // Close the connection
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('Error:', err);
    });

    // Add the chips
    const new_defs = await get_definitions_for_new_chips(article_meta.chips)

    // Ensure the chips has definitions
    for (const chip of new_defs) {
        await add_chip(chip.name, chip.description)
    }
}

async function add_view(articleId) {
    try {
      await mongoose.connect("mongodb://localhost:27017/articles");
  
      const updatedArticle = await Article.findByIdAndUpdate(
        articleId,
        { $inc: { views: 1 } },
        { new: true }
      );
  
      console.log('Updated article:', updatedArticle);
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Internal server error');
    } finally {
      // Close the database connection
      await mongoose.connection.close();
    }
  }

module.exports = {
    get_unique_chips,
    get_all_ready_articles,
    create_article,
    add_view
};
