// const path = require('path');
// const fss = require('fs');
// const fs = require('fs').promises;
// const readline = require('readline');
// const { delete_directory, askQuestion, rename_directory} = require('./misc_utils.js')
// const { validate_chips_have_svgs } = require('./validate_svgs.js')
// const { ensure_article_dir_has_correct_files } = require('./validate_article.js')
// const { copy_chip_defintiions, validate_chips_have_definitions} = require('./validate_chips.js')
// const { does_temp_meta_dir_exist, make_temp_dir, delete_temp_dir } = require('./prepare_meta_dir.js');
// const { error } = require('console');
// const { articles_dir, metas_dir, temp_meta_dir, svg_dir, temp_unique_chips_path, unique_chips_path, temp_home_posts_path, home_posts_path, temp_chip_definition_path, chip_definition_path } = require('./path_consts')


// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// /**
//  * Reads through articles directory and create a home_posts.json summary of them.
//  * This file is essential in the CMS operating
//  * @param {string} save_directory - The path of the dir the home_posts file saves to
//  * @returns {string} The SVG file name in lowercase.
//  */
// async function generate_home_posts(save_directory, articles_dir, ignore_example_article=true) {
//   let compiledData = [];

//   // Get the articles directory
//   const subDirs = await fs.readdir(articles_dir, { withFileTypes: true });
//   // Get all of the indivudual article directories
//   for (const dir of subDirs.filter(dirent => dirent.isDirectory())) {
//     const metaPath = path.join(articles_dir, dir.name);
//     if (ignore_example_article && dir.name==".example") continue;

//     // Verify That the current article is ready for deployment
//     if (await !ensure_article_dir_has_correct_files(metaPath)){
//       return false
//     }

//     try {
//       const metaPath = path.join(articles_dir, dir.name, 'meta.json');
//         const metaData = await fs.readFile(metaPath, 'utf8');
//         let obj = JSON.parse(metaData)
//         obj["source"] = dir.name
//         compiledData.push(obj);
//     } catch (err) {
//         console.error(`Error reading the meta file in ${dir.name}:`, err);
//     }
//   }

//   const dataString = JSON.stringify(compiledData, null, 2);

//   const filePath = path.join(save_directory, `home_posts.json`);

//   fss.writeFileSync(filePath, dataString);

//   return true

// }

// // Refresh homeposts.json and uniquechips.json
// async function start() {
//     try{
//       if (await does_temp_meta_dir_exist(temp_meta_dir)) {
//         const answer = await askQuestion("The Temp directory already exists. Would you like to delete it? (y/n)")
//         console.log(answer)
//         if (answer.trim().toLowerCase() === "y") {
//           await delete_temp_dir(temp_meta_dir);
//           if (await does_temp_meta_dir_exist(temp_meta_dir)) {
//               throw error ("Failed to delete temp directory. Quitting")
//               process.exit(0);
//           }
//         }
//         else console.log("Quitting...")
//       }

//       if (await !make_temp_dir(temp_meta_dir)) {
//         throw error ("Failed to create temp directory. Quitting")
//         process.exit(0);
//       }


//       console.log("generating home posts...")

//       await generate_home_posts(temp_meta_dir, articles_dir)

//       console.log("generated home posts succefully.\n")


//       console.log("generating unique chips...")

//       // await generate_unique_chips(temp_meta_dir, temp_home_posts_path);

//       console.log("generated unique chips succefully.\n")


//       console.log("validating chip SVGS...")

//       if (!await validate_chips_have_svgs(svg_dir, temp_unique_chips_path)) {
//         console.log("There are missing SVGs. Quitting...")
//         process.exit(0);
//       }

//       console.log("Validated chip SVGs succefully.\n")

//       await copy_chip_defintiions({from: chip_definition_path, to: temp_chip_definition_path})


//       console.log("validating chip definitions...")

//       await validate_chips_have_definitions(temp_unique_chips_path, temp_chip_definition_path, temp_chip_definition_path)

//       console.log("validated chip definitions succefully.\n")

//       console.log("Transferring temp directory to meta_resources...")

//       await delete_directory(metas_dir)

//       await rename_directory(temp_meta_dir, metas_dir)
//     } catch (err) {
//       console.log(err)
//     }


//     process.exit(0);
// }

// start();