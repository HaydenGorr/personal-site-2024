const fs = require('fs').promises;
const path = require('path');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../..', 'cms_data');

const articles_dir = path.join(DATA_DIR, './CMS/articles/');
const metas_dir = path.join(DATA_DIR, './meta_resources/');
const temp_meta_dir = path.join(DATA_DIR, './temp_meta_resources/');

module.exports = { articles_dir, metas_dir, temp_meta_dir };