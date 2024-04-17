const { articles_dir, metas_dir, temp_meta_dir, svg_dir, temp_unique_chips_path, unique_chips_path, temp_home_posts_path, home_posts_path, temp_chip_definition_path, chip_definition_path } = require('./path_consts')

async function get_all_articles() {
    let compiledData = [];
  
    // Get the articles directory
    const subDirs = await fs.readdir(articles_dir, { withFileTypes: true });
    // Get all of the indivudual article directories
    for (const dir of subDirs.filter(dirent => dirent.isDirectory())) {
      const metaPath = path.join(articles_dir, dir.name);
      if (ignore_example_article && dir.name==".example") continue;
  
      // Verify That the current article is ready for deployment
      if (await !ensure_article_dir_has_correct_files(metaPath)){
        return false
      }
  
      try {
        const metaPath = path.join(articles_dir, dir.name, 'meta.json');
          const metaData = await fs.readFile(metaPath, 'utf8');
          let obj = JSON.parse(metaData)
          obj["source"] = dir.name
          compiledData.push(obj);
      } catch (err) {
          console.error(`Error reading the meta file in ${dir.name}:`, err);
      }
    }
  
    // const dataString = JSON.stringify(compiledData, null, 2);
  
    // const filePath = path.join(save_directory, `home_posts.json`);
  
    // fss.writeFileSync(filePath, dataString);
  
    return compiledData
  
  }

module.exports = { get_all_articles };
