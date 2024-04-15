const fs = require('fs').promises;
const { readJSON } = require('./misc_utils')
const { askQuestion } = require('./misc_utils')

/**
 * Reads the unique chips file and ensures every chips has an svg
 * @param {string} path_to_svgs - The path to the svg directors.
 * @param {string} path_to_unique_chips - The path to the unique_chips json file.
 * @returns {string} The SVG file name in lowercase.
 */
async function validate_chips_have_definitions(path_to_unique_chips, path_to_chip_defintitions, save_dir) {
    const uniqueChips = await readJSON(path_to_unique_chips);
    const chipDefinitions = await readJSON(path_to_chip_defintitions) || [];

    for (const chipName of uniqueChips) {
        const chipDefinition = chipDefinitions.find((chip) => chip.name === chipName);
        if (!chipDefinition) {
          const description = await askQuestion(`Enter a description for "${chipName}"`);
          chipDefinitions.push({ name: chipName, description });
        } else if (!chipDefinition.description) {
          const description = await askQuestion(`Enter a description for "${chipName}"`);
          chipDefinition.description = description;
        }
    }

    const jsonString = JSON.stringify(chipDefinitions, null, 2);
    await fs.writeFile(save_dir, jsonString, 'utf8');

}   

async function copy_chip_defintiions({from, to}) {
    try {
        await fs.copyFile(from, to);
        return true
    } catch (error) {
        console.error(`Error copying file: ${error}`);
        return true
    } 
}

module.exports = {
    validate_chips_have_definitions,
    copy_chip_defintiions
};
  