const fs = require('fs').promises;
const { temp_meta_dir } = require('./path_consts')
const readline = require('readline');

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

async function delete_directory(path) {
  try {
    await fs.rm(path, { recursive: true, force: true });
    console.log(`Directory deleted successfully: ${path}`);
  } catch (err) {
    console.error(`Error deleting directory: ${err}`);
  }
}

async function rename_directory(oldPath, newPath) {
  try {
    await fs.rename(oldPath, newPath);
    console.log(`Directory renamed successfully from ${oldPath} to ${newPath}`);
  } catch (err) {
    console.error(`Error renaming directory: ${err}`);
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


async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file: ${error}`);
    return null;
  }
}

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

module.exports = { make_temp_dir, delete_temp_dir, checkDirectoryExists, readJSON, askQuestion, delete_directory, rename_directory };
