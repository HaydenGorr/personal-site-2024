const fs = require('fs').promises;
const path = require('path');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../..', 'cms_data');
const { articles_dir, metas_dir, temp_meta_dir } = require('./path_consts')

/**
 * We create a temporary folder before generating home_posts and unique_chips jsons
 * We store them here and when the entire process is done including validation
 * we move all of this content into the main meta_resources
 */
async function make_temp_dir() {
    try {
        // Use path.join to ensure the correct path format
        await fs.mkdir(temp_meta_dir, { recursive: true });
        return true;
    } catch (err) {
        console.error(err); // It's often good to log the error for debugging.
        return false;
    }
}


async function delete_temp_dir() {
    try {
        // Use path.join to ensure the correct path format
        await fs.rm(temp_meta_dir, { recursive: true });
        return true;
    } catch (err) {
        console.error(err); // It's often good to log the error for debugging.
        return false;
    }
}

async function checkDirectoryExists(dirPath) {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      }
      throw err;
    }
  }


module.exports = { make_temp_dir, delete_temp_dir, checkDirectoryExists };
