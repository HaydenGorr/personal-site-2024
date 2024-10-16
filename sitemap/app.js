require('dotenv').config({ path: process.env.ENV_FILE });
const cron = require('node-cron');
const { create } = require('xmlbuilder2')
const fs = require('fs');
const path = require('path');
const { assert } = require('console');
const fsPromises = require('fs/promises');

// Run once a day
cron.schedule('30 2 * * * ', async () => {

    await run_xml_generation_and_saving_process()

});

const run_xml_generation_and_saving_process = async () => {

    if (await !check_connection()) {
        console.log("failed to establish connection to CMS. Aborting")
        return
    }
    
    const xml_file = await create_the_xml()
    const success = await save_the_XML(xml_file)

    if (success){
        console.log("success")
        const result = await fetch(`${process.env.DOMAIN_URL}/sitemap.xml`)
        const result_text = await result.text()
        assert(result_text == xml_file)
    }
}

const check_connection = async () => {
    var success = false
    for (let i = 0; i < 5; i++) {
        try {
            const asd = await fetch(`${process.env.LOCAL_ACCESS_CMS}/secure/edit_chip`);
            if (asd.ok) {
                success = true
            }
        } catch (e) {
            console.log("psplus", e);
        }
        if (success) break
    }
    return success
}

const create_the_xml = async () => {
    try {
        const res = await fetch(`${process.env.LOCAL_ACCESS_CMS}/get_all_ready_articles`);
        const json_result = await res.json();
        const data = json_result.data.length > process.env.SITEMAP_ARTICLE_LIMIT ? json_result.data.slice(0, 9) : json_result.data
        
        const formatted_data = data.map((article, index) => {
            return {
                url: `${process.env.DOMAIN_URL}/article/${article.source}`,
                lastmod: format_date_for_sitemap(article.publishDate)
            }
        })

        const sitemap = create({ version: '1.0' }).ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });

        formatted_data.forEach(article => {
            sitemap.ele('url')
                .ele('loc').txt(article.url).up()
                .ele('lastmod').txt(article.lastmod).up()
                .ele('changefreq').txt('never').up()
                .ele('priority').txt('0.5').up();
        });

        sitemap.ele('url')
            .ele('loc').txt(process.env.DOMAIN_URL).up()
            .ele('lastmod').txt(format_date_for_sitemap(data[0].publishDate)).up()
            .ele('changefreq').txt('weekly').up()
            .ele('priority').txt('0.9').up();

        const xmlString = sitemap.end({ prettyPrint: true });

        return xmlString

    } catch (e) {
        console.log(e);
    }

};

const save_the_XML = async (xmlContent) => {
    try {
        const abs_public_folder_path = path.resolve(__dirname, process.env.WEBSERVER_PUBLIC_FOLDER_URL);
        const xml_file_path = path.resolve(abs_public_folder_path, "sitemap.xml");

        // Check if the directory exists and is writable
        await fsPromises.access(abs_public_folder_path, fs.constants.F_OK | fs.constants.W_OK);

        // Write the XML content to the file
        await fsPromises.writeFile(xml_file_path, xmlContent, 'utf8');

        console.log(`Sitemap saved successfully at ${xml_file_path}`);
        return true;
    } catch (err) {
        console.error(`Error: ${err.message}`);
        return false;
    }
};

function format_date_for_sitemap(dateString) {
    const date = new Date(dateString);
    // Extract the date portion (YYYY-MM-DD)
    return date.toISOString().split('T')[0];
}

// This ensure it runs once on start up immedaitely
run_xml_generation_and_saving_process()