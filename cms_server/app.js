require('dotenv').config({ path: process.env.ENV_FILE });
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'cms_data');
const { get_unique_chips, get_all_ready_articles, create_article, add_view } = require('./utils/mongo_utils');
const { get_article } = require('./utils/mongo_utils/get_article')
const Cookies = require('js-cookie');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { get_users_by_username } = require('./utils/mongo_utils/get_user_by_username')
const { add_user } = require('./utils/mongo_utils/add_user')

app.use(cors());
app.use(express.json());

const secretKey = 'your-secret-key';

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
app.get('/get_article_meta', async (req, res) => {
  const {articlesrc} = req.query

  const article = await get_article(articlesrc)

  if (article.length === 0) res.status(404).json({ error: 'Article not found' });

  res.json(article[0])

})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log("loggging in: ", username, password)

  const users = await get_users_by_username(username, password)

  console.log("got users: ", users)
  
  if (users.length > 0){
    var user = users[0]
  }
  else {
    console.log(users)
    console.log("no users found.")
    return
  }

  try {
    console.log("validate password")
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("validated")

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log("creating token")
    const token = await jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    console.log("creatied token")

    res.json({ token });
  } catch(error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

})

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password)

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!await add_user(username, hashedPassword)) {
      console.log("Failed to add user")
      return
    }

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


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