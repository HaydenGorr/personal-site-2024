const fs = require('fs');
const path = require('path');

/**
 * Check that meta.json, article.mdx, container.png, and if any images are used in the article, it checks that the articles exist
 * in the correct subdir. If this passes, the article should be ready to go.
 * @param {string} path_to_article A path to the article directory which conatins article.mdx, meta.json, etc.
 * @returns pass or fail for the given article
 */
async function ensure_article_dir_has_correct_files(path_to_article) {
    // Check if the directory exists
    const dirExists = await fs.promises.stat(path_to_article).then(stats => stats.isDirectory()).catch(() => false);
    if (!dirExists) {
        throw new Error(`Directory ${path_to_article} does not exist.`);
    }

    // Define the required files for an article
    const requiredFiles = ["article.mdx", "container.png", "meta.json", "article_images"];
    let article_images_exists; // Default to false, but we set below

    // Check if all required files exist in the directory
    for (const file of requiredFiles) {
        const filePath = path.join(path_to_article, file);
        const fileExists = await fs.promises.stat(filePath).then(stats => stats.isFile()).catch(() => false);

        if (file === "article_images") {
            try {
                await fs.promises.stat(filePath);
                article_images_exists = true;
            } catch (error) {
                article_images_exists = false;
            }
            continue;
        }

        if (!fileExists) {
            console.log(`Required file ${file} is missing.`);
            throw new Error(`Required file ${file} is missing.`);
        }
    }

    // Check if the article.mdx file contains the required images
    const referenced_images = await get_images_referenced_in_article(path.join(path_to_article, "article.mdx"))

    if (!referenced_images) return

    // If we have images but no article_images dir, throw error
    if (referenced_images && !article_images_exists){
        throw new Error(`There are Image Wrapper elements in the article ${path_to_article}, but no article_images directory to contain them.`);
    }

    // Check that the images exist
    const missingImages = referenced_images.filter(image => {
        const imagePath = path.join(path_to_article, "article_images", image);
        return !fs.existsSync(imagePath);
    });

    if (missingImages.length === 0) {
    } else {
        throw new Error(`For the Article: ${path_to_article} The following images are missing: ${missingImages}`);
    }
}


async function get_images_referenced_in_article(artice_mdx_path){
    // Read the content of the MDX file
    const mdxFilePath = path.join(artice_mdx_path);
    const mdxContent = await fs.promises.readFile(mdxFilePath, 'utf-8');

    // Define a regular expression to match <ImageWrapper> components
    const regex = /<ImageWrapper[^>]+src={\`CMS\/articles\/[^/]+\/article_images\/([^`]+)\`}/g;
    const fileNameRegex = /[^/`]+(?=\`}$)/;

    // Match all <ImageWrapper> components in the MDX content
    const matches = mdxContent.match(regex);

    var images = []

    if (matches === null) return false

    for (const match of matches) {
        const file = match.match(fileNameRegex)[0];

        images.push(file)
        // const imagePath = path.join(path_to_article, imageSrc);
        // try {
        //     // Check if the image file exists
        //     await fs.stat(imagePath);
        //     console.log(`Image ${imageSrc} referenced in the MDX file exists.`);
        // } catch (error) {
        //     throw new Error(`Image ${imageSrc} referenced in the MDX file does not exist.`);
        // }
    }

    return images

}

module.exports = {
    ensure_article_dir_has_correct_files,
};
