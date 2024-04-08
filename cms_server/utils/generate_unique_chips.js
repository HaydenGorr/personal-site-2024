const path = require('path');
const fs = require('fs')
const { getDatetimeJsonPath, deleteUniqueChips } = require('./get_file_paths.js')
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../..', 'cms_data');

function generateUniqueChips(posts) {
    const allChips = posts.flatMap(post => post.chips);
    
    var chip_array = [...new Set(allChips)];

    chip_array.sort((a, b) => a.localeCompare(b));

    return chip_array
}


async function begin(){

    console.log("Generating unique chips...")

    const hp_path = await getDatetimeJsonPath("home_posts")
    const home_posts = require(hp_path)

    console.log("Obtained home_posts")

    const data = generateUniqueChips(home_posts);

    console.log("generated unique chips from home_posts")

    const dataString = JSON.stringify(data, null, 2);

    console.log("stringified unique chips")

    try {

        const dateTime = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');

        await deleteUniqueChips()
        console.log("deleted old unique_chips file")

        console.log("Writing new unique chips file")
        await fs.writeFileSync(path.join(DATA_DIR, `./meta_resources/unique_chips_${dateTime}.json`), dataString);
        console.log('JSON data is saved.');
    } catch (error) {
        console.error('Error writing file:', error);
    }
}

module.exports = { begin };