const fs = require('fs').promises;
const path = require('path');

const articlesDir = path.join(__dirname, '../CMS/articles/');
const metasDir = path.join(__dirname, '../meta_resources/');

async function getDatetimeJsonPath(startsWith) {
    try {
        const files = await fs.readdir(metasDir);
        const filteredFiles = files.filter(file => file.startsWith(startsWith) && file.endsWith('.json'));
        const latestFile = filteredFiles.sort().reverse()[0];
        
        if (!latestFile) {
            console.log('No matching files found.');
            return null; // Return null instead of false to indicate no path was found
        }
        
        return path.join(metasDir, latestFile);
    } catch (error) {
        console.error('Error reading directory:', error);
        return null;
    }
}

async function deleteFile(filePath) {
    try {
        await fs.unlink(filePath);
        console.log('File deleted successfully');
    } catch (err) {
        console.error('Error deleting file:', err);
    }
}

async function deleteHomePosts() {
    const filePath = await getDatetimeJsonPath("home_posts");
    if (filePath) {
        await deleteFile(filePath);
    }
}

async function deleteUniqueChips() {
    const filePath = await getDatetimeJsonPath("unique_chips");
    if (filePath) {
        await deleteFile(filePath);
    }
}

module.exports = { getDatetimeJsonPath, deleteUniqueChips, deleteHomePosts, articlesDir, metasDir };