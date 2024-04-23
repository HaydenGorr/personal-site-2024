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
const cookieParser = require('cookie-parser');
const { get_all_articles } = require('./utils/mongo_utils/get_article')
const { validate_JWT } = require('./utils/validate_JWT')
const dbConnect = require('./utils/db_conn')
const { Response } = require('./utils/response_obj')

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ['http://localhost:3000', 'https://your-production-domain.com'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const secretKey = 'your-secret-key';

/**
 * THIS IS A REPLACEMENT FOR HOME_POSTS AND UNIQUE CHIPS
 */
app.get('/get_all_ready_articles', async (req, res) => {

  const response = await get_all_ready_articles()

  res.json(response);

});

app.get('/get_unique_chips', async (req, res) => {
  console.log("called: get unique chips")

  const response = await get_unique_chips()

  res.json(response)
    
});

app.get('/add_view', async (req, res) => {})

app.get('/create_article', async (req, res) => {

  console.log("called: create_article")

  await create_article(req.query)

  if (response.code != 200) {
    await res.status(response.code).json({ error: response.error_msg });
  }else {
    res.json(response)
  }
})

app.get('/get_article_meta', async (req, res) => {

  console.log("called: get_article_meta")

  const {articlesrc} = req.query

  const article = await get_article(articlesrc)

  if (article.length === 0) res.status(404).json({ error: 'Article not found' });

  res.json(article[0])

})

app.get('/loggedIn', async (req, res) => {
  console.log("User opened login page");

  const token = req.cookies.token;
  if (!token) {
    // If no token is provided, send a response indicating that the user is not logged in
    return res.status(200).json({ loggedIn: false });
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, secretKey);

    // If the token is valid, send a response indicating that the user is logged in
    return res.status(200).json({ loggedIn: true });
  } catch (error) {
    // If the token is invalid or has expired, send a response indicating that the user is not logged in
    return res.status(200).json({ loggedIn: false });
  }
});

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


/**
 * SECURE ENDPOINTS
 */
app.get('/secure/get_all_articles', async (req, res) => {

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    return res.status(result.errorcode).json({ error: result.message });
  }
  
  // Grab and return the articles
  const articles = await get_all_articles()
  res.json(articles);
  
  // console.log(token)

  // if (!token) {
  //   return res.status(401).json({ error: 'No token provided' });
  // }

  // console.log(token)

  // try {
  //   // Verify the JWT
  //   const decoded = jwt.verify(token, secretKey);

  //   // Access the decoded payload
  //   const userId = decoded.userId;

  //   const articles = await get_all_articles()

  //   console.log("FROM DB: ", articles)

  //   res.json(articles);
  // } catch (error) {
  //   if (error instanceof jwt.JsonWebTokenError) {
  //     return res.status(401).json({ error: 'Invalid token' });
  //   }
  //   console.error('Error accessing protected resource:', error);
  //   res.status(500).json({ error: 'Internal server error' });
  // }

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