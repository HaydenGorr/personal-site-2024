const { Article } = require('../mongo_schemas/article_schema.js');
const { Chip } = require('../mongo_schemas/chip_schema.js');
const { MONOGDB_ARTICLES, MONOGDB_CHIPS, articles_dir } = require('./path_consts.js');
const path = require('path');
const { validate_article_before_publishing } = require('./validate_before_publishing.js')
const { readJSON, askQuestion } = require('./misc_utils.js')
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

async function update_article(article_dir_name, updates_obj, article_meta){

  console.log("updating now")

  await mongoose.connect(MONOGDB_ARTICLES)
  .then(async () => {
      const filter = { source: article_dir_name };  // Criteria to find the document

      // Dynamically create the $set object based on updates_obj
      let updateData = {};
      if (updates_obj.hasOwnProperty('title')) updateData.title = updates_obj.title;
      if (updates_obj.hasOwnProperty('desc')) updateData.desc = updates_obj.desc;
      if (updates_obj.hasOwnProperty('infoText')) updateData.infoText = updates_obj.infoText;
      if (updates_obj.hasOwnProperty('chips')) updateData.chips = updates_obj.chips;

      const update = { $set: updateData };

      const options = {
          new: true,  // Return the modified document rather than the original
          upsert: false  // Create a new document if no documents match the filter
      };

      // Update the document
      return Article.findOneAndUpdate(filter, update, options);
  })
  .then((doc) => {
      console.log('Document updated successfully', doc);
      // Close the connection
      mongoose.connection.close();
  })
  .catch((err) => {
      console.error('Error:', err);
  });
}

/**
 * Takes a new article in cms_data, validates it and adds it to the database
 * @param {String} article_dir_name - The name of the dir containing the article you're creating
 */
async function create_article({article}){

    const article_dir_name = article

    console.log("creating article: ", article)

    const new_article_path = path.join(articles_dir, article_dir_name);

    /**
     * This will return false, true, or an array of props.
     * it returns an array of props if the article has already been published AND
     * the meta.file doesn't match the DB entry. This means that the article has been
     * updated locally and this update needs to be reflected in the DB
     */
    const result = await validate_article_before_publishing(new_article_path, article_dir_name)

    console.log(result)
    console.log("here2")

    // If result is false. validate_article_before_publishing() should never return an empty array
    if(!result) return false

    console.log("here3")

    const article_meta = await readJSON(path.join(new_article_path, "meta.json"))

    console.log("here4")

    if (typeof result == "object") {
      console.log("This article has already been published, but there are updates to commit")
      console.log("The updates: ", result)
      await update_article(article_dir_name, result, article_meta)
    }else {
      // Create a whole new article record
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
    }

    return

    // Add the chips
    const new_defs = await get_definitions_for_new_chips(article_meta.chips)

    // Ensure the chips has definitions
    for (const chip of new_defs) {
        await add_chip(chip.name, chip.description)
    }
}

async function add_view(articleId) {
    try {
      await mongoose.connect(MONOGDB_ARTICLES);
  
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
