require('dotenv').config({ path: process.env.ENV_FILE });
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'cms_data');
const { get_unique_chips, get_all_ready_articles, create_article, add_view } = require('./utils/mongo_utils');

app.use(cors());
app.use(express.json());

/**
 * THIS IS A REPLACEMENT FOR HOME_POSTS AND UNIQUE CHIPS
 */
app.get('/get_all_ready_articles', async (req, res) => {

    const result = await get_all_ready_articles()

    if (result.error) {res.status(500).json({ error: 'Internal server error' }); return}

    res.json(result);


});
app.get('/get_unique_chips', async (req, res) => {
    const chips = await get_unique_chips()

    if (!chips) res.status(500).json({ error: 'Internal server error' });

    res.json(chips)
});

app.get('/add_view', async (req, res) => {})
app.get('/create_article', async (req, res) => {create_article(req.query)})

app.use(`/CMS/articles/`, express.static(path.join(DATA_DIR, 'CMS', 'articles')));
app.use('/TAG_SVGS/', express.static(path.join(DATA_DIR, 'TAG_SVGS')));

app.get(`/favicon`, async (req, res) => {
    const { href } = req.query;
    let faviconUrl = null;
  
    try {
      const url = new URL(href);
      faviconUrl = `${url.origin}/favicon.ico`;
  
      const response = await fetch(faviconUrl);
      if (!response.ok) {
        faviconUrl = null;
      }
    } catch (e) {
      console.log(e);
    }
  
    res.json({ faviconUrl });
  });
/**
 * the :: here makes the server listen on an ipv6 address. 
 * the NextJS webserver automatically resolves localhost to ipv6
 */
app.listen(PORT, '::', () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = DATA_DIR;