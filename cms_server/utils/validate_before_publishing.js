const path = require('path');
const {} = require('./path_consts.js')
const { ensure_article_dir_has_correct_files } = require('./validate_article.js')
const { validate_chips_in_article } = require('./validate_svgs.js')
const { readJSON } = require('./misc_utils.js')
const { is_this_article_already_published } = require('./mongo_utils/is_article_published.js')
const { compare_meta_to_DB_entry } = require('./mongo_utils/compare_meta_to_DB_entry.js')

/**
 * Validate an article and ensure it's ready to publish
 * @param {String} article_dir_path Path to new article to be validated
 * @param {String} article_dir_name the name of the folder containing the article
 * @returns 
 */
async function validate_article_before_publishing(article_dir_path, article_dir_name){
    const article_meta = await readJSON(path.join(article_dir_path, "meta.json"));

    /**
     * Check if the article is already published
     * If it is, check if the meta.json differs from the DB entry.
     * If it does differ offer to update the DB entry to match the new meta.
     */
    const db_entries = await is_this_article_already_published(article_dir_name)
    const db_entry = db_entries[0]
    if (db_entry){

        console.log("article has been published before")
        console.log("checking if the meta.json differs from the DB entry")
        var differing_props = await compare_meta_to_DB_entry(article_meta, db_entry)

        if (Object.keys(differing_props).length === 0) {
            console.log(`Article in ${article_dir_name} is already published. There are no updates in meta.json. Quitting...`)
            return false
        }
    }

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

    console.log("here")
    
    return differing_props ? (Object.keys(differing_props).length === 0 ? true : differing_props) : true;

}

module.exports = {
    validate_article_before_publishing,
};
