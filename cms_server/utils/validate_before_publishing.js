const path = require('path');
const {} = require('./path_consts.js')
const { ensure_article_dir_has_correct_files } = require('./validate_article.js')
const { validate_chips_in_article } = require('./validate_svgs.js')
const { readJSON } = require('../utils/misc_utils.js')
/**
 * Validate an article and ensure it's ready to publish
 * @param {String} article_dir_path Path to new article to be validated
 * @param {String} article_dir_name the name of the folder containing the article
 * @returns 
 */
async function validate_article_before_publishing(article_dir_path, article_dir_name){
    const article_meta = await readJSON(path.join(article_dir_path, "meta.json"));

    // Ensure the right files are there
    if (await !ensure_article_dir_has_correct_files(article_dir_path)){
        console.log("There are missing files. Quitting...")
        return false
    }

    // Ensure the chips in the article have svgs
    if (!await validate_chips_in_article(article_meta.chips)) {
        console.log("There are missing SVGs. Quitting...")
        return false
    }

    // if (await is_this_article_already_published(article_dir_name)){
    //     console.log(`Article in ${article_dir_path} is already published Quitting...`)
    //     return false
    // }
    
    return true
}

module.exports = {
    validate_article_before_publishing,
};
