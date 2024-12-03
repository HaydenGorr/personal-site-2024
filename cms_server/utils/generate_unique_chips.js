import path from 'path';
import fs from 'fs';

function generate_non_repeating_list_of_chips_from_home_posts(posts) {
    const allChips = posts.flatMap(post => post.chips);
    
    var chip_array = [...new Set(allChips)];

    chip_array.sort((a, b) => a.localeCompare(b));

    return chip_array
}

/**
 * Reads through the home_posts and condenses all of the chips to a nonrepeating array
 * and saves it as a json
 * @param {string} save_directory - The path of the dir the home_posts file saves to
 */
async function generate_unique_chips(save_directory, home_posts_path){

    // const home_posts = require(home_posts_path)

    // const data = generate_non_repeating_list_of_chips_from_home_posts(home_posts);

    // const dataString = JSON.stringify(data, null, 2);

    // try {

    //     await fs.writeFileSync(path.join(save_directory, "unique_chips.json"), dataString);
    //     console.log('JSON data is saved.');
    // } catch (error) {
    //     console.error('Error writing file:', error);
    // }
}

module.exports = { generate_unique_chips };