require('dotenv').config({ path: process.env.ENV_FILE });
const run_xml_generation_and_saving_process = require('./sitemap/script')

// Run once a day
cron.schedule('30 2 * * * ', async () => {

    await run_xml_generation_and_saving_process()

});