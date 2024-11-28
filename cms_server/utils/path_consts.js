import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../..', 'cms_data');

const MONGODB_BASE = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@localhost:${process.env.MONGO_PORT}`;
const MONOGDB_ARTICLES = MONGODB_BASE + '/articles?authSource=<authenticationDatabase>';
const MONOGDB_CHIPS = MONGODB_BASE + '/chips?authSource=<authenticationDatabase>';
const MONOGDB_USERS = MONGODB_BASE + '/users?authSource=<authenticationDatabase>';

const articles_dir = path.join(DATA_DIR, './CMS/articles/');
const images_dir = path.join(DATA_DIR, './images/');
const metas_dir = path.join(DATA_DIR, './meta_resources/');
const temp_meta_dir = path.join(DATA_DIR, './temp_meta_resources/');
const svg_dir = path.join(DATA_DIR, './TAG_SVGS/');
const temp_unique_chips_path = path.join(DATA_DIR, './temp_meta_resources/unique_chips.json');
const unique_chips_path = path.join(DATA_DIR, './meta_resources/unique_chips.json');
const temp_home_posts_path = path.join(DATA_DIR, './temp_meta_resources/home_posts.json');
const home_posts_path = path.join(DATA_DIR, './meta_resources/home_posts.json');
const temp_chip_definition_path = path.join(DATA_DIR, './temp_meta_resources/chip_definitions.json');
const chip_definition_path = path.join(DATA_DIR, './meta_resources/chip_definitions.json');

export { 
    DATA_DIR, 
    MONOGDB_USERS, 
    MONOGDB_ARTICLES, 
    MONGODB_BASE, 
    MONOGDB_CHIPS, 
    articles_dir, 
    metas_dir, 
    temp_meta_dir, 
    svg_dir, 
    temp_unique_chips_path, 
    unique_chips_path, 
    temp_home_posts_path, 
    home_posts_path, 
    temp_chip_definition_path, 
    chip_definition_path,
    images_dir 
};