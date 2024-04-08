const path = require('path');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../..', 'cms_data');
const fss = require('fs');
const fs = require('fs').promises;
const { begin } = require('./generate_unique_chips.js')
const { getDatetimeJsonPath, deleteUniqueChips, deleteHomePosts, articlesDir, metasDir } = require('./get_file_paths.js')

async function get_home_posts() {
    const path = await getDatetimeJsonPath("home_posts")
    console.log("got home_posts path")

    if (!path) return false;

    try {
        const data = await fs.readFile(path, 'utf8');

        console.log("obtained home_posts.json.  -   returning...")

        return JSON.parse(data)
    } catch (error) {
        console.error('Error reading the latest home_posts file:', error);
    }
}

async function createHomePostsFile(data) {
    const dataString = JSON.stringify(data, null, 2);

    const dateTime = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
    const directoryPath = path.join(DATA_DIR, './meta_resources');
    const filePath = path.join(directoryPath, `home_posts_${dateTime}.json`);

    console.log("wrote new home_posts.json to meta_resources")

    fss.writeFileSync(filePath, dataString);
}

async function countMdxFiles(dir = articlesDir) {

    // const dir = '../CMS/articles/'

    let count = 0;
  
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        count += await countMdxFiles(fullPath);
      } else {
        if (path.extname(fullPath) === '.mdx') {
          count++;
        }
      }
    }
  
    return count;
}

async function compileHomePosts() {
    let compiledData = [];

    // Step 1: Traverse the articles directory
    const subDirs = await fs.readdir(articlesDir, { withFileTypes: true });
    for (const dir of subDirs.filter(dirent => dirent.isDirectory())) {
        const metaPath = path.join(articlesDir, dir.name, 'meta.json');
        try {
            const metaData = await fs.readFile(metaPath, 'utf8');
            let obj = JSON.parse(metaData)
            obj["source"] = dir.name
            compiledData.push(obj);
        } catch (err) {
            console.error(`Error reading the meta file in ${dir.name}:`, err);
        }
    }

    await createHomePostsFile(compiledData);
}

async function start() {

    if (! await get_home_posts()) await createHomePostsFile([]);

    console.log("Got home_posts.json from CMS")

    console.log("deleting home_posts.json")

    await deleteHomePosts();

    console.log("compiling new home_posts.json")

    await compileHomePosts();

    // begin creating unique_chips.json
    await begin();
}

start();