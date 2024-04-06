const path = require('path');
const fs = require('fs')
const { getDatetimeJsonPath, deleteUniqueChips } = require('./get_file_paths.js')


function generateUniqueChips(posts) {
    const allChips = posts.flatMap(post => post.chips);
    
    var chip_array = [...new Set(allChips)];

    chip_array.sort((a, b) => a.localeCompare(b));

    return chip_array
}


async function begin(){

    const hp_path = await getDatetimeJsonPath("home_posts")
    const home_posts = require(hp_path)

    const data = generateUniqueChips(home_posts);

    const dataString = JSON.stringify(data, null, 2);

    try {

        const dateTime = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');

        deleteUniqueChips()

        await fs.writeFileSync(path.join(__dirname, `../meta_resources/unique_chips_${dateTime}.json`), dataString);
        console.log('JSON data is saved.');
    } catch (error) {
        console.error('Error writing file:', error);
    }
}

module.exports = { begin };