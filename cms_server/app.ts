require('dotenv').config({ path: process.env.ENV_FILE });
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
// const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'cms_data');
const { get_unique_chips, get_all_ready_articles, create_article, get_all_ready_portfolio_articles, check_if_best_article_exists } = require('./utils/mongo_utils');
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
const multer = require('multer');
const { DATA_DIR, svg_dir } = require('./utils/path_consts')
const { get_chip } = require('./utils/mongo_utils/get_chips')
const { add_chip } = require('./utils/mongo_utils/add_chip')
const fss = require('fs').promises;
const fs = require('fs');
const { updatedArticle } = require('./utils/mongo_utils/update_article')
const { add_article } = require('./utils/mongo_utils/add_article')
const { deleteArticle } = require('./utils/mongo_utils/delete_article')
const { edit_chip } = require('./utils/mongo_utils/edit_chip')
const { deleteChip } = require('./utils/mongo_utils/delete_chip');
const { get_all_categories } = require('./utils/mongo_utils/get_categories');
const { add_category } = require('./utils/mongo_utils/add_category')
// const { get_all_categories } = require('./endpoint_logic/categories')
import { api_return_schema, article, category } from "./interfaces/interfaces"
import { Request, Response } from 'express';
const { DeleteCategory } = require("./utils/mongo_utils/delete_category")

declare module 'express' {
  export interface Request {
    cookies: { [key: string]: string };
  }
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const allowedOrigins = ['http://localhost:3000', 'https://www.haydengorringe.com', 'http://localhost:3004'];

const JWTMiddleware = (req: Request, res: Response, next: any) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("User did not provide a token");
    return res.status(401).json({
      data: false,
      error: {
        has_error: true,
        error_message: "User did not provide a token",
      }
    });
  }
  
  next();
};

const cors_middleware = cors({
  origin: function(origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
})

app.use(express.json());
app.use(cookieParser());
app.use(cors_middleware);

const protectedRouter = express.Router();
protectedRouter.use(JWTMiddleware);

app.use('/secure', protectedRouter);

/**
 * THIS IS A REPLACEMENT FOR HOME_POSTS AND UNIQUE CHIPS
 */
app.get('/get_all_ready_articles', async (req: Request, res: Response) => {

  console.log("getting all articles marked ready")

  const response = await get_all_ready_articles()

  // console.log(`${response.data.length} ready articles retrieved`)
  console.log(response)

  res.json(response);

});

app.get('/get_all_ready_portfolio_articles', async (req: Request, res: Response) => {

  console.log("getting all portfolio articles marked ready")

  var response = await get_all_ready_portfolio_articles()

  for (let i = 0; i < response.data.length; i++) {
    if (await check_if_best_article_exists(response.data[i].source)) {
      response.data[i]["has_best_article"] = true
    }
  }

  console.log(response.data)

  if (response.error){
    res.json(response);
  }
  else {
    const updatedData = await Promise.all(response.data.map(async (article: any) => {
      const hasBestArticle = await check_if_best_article_exists(article.source);
      return { ...article._doc, has_best_article: hasBestArticle };
    }));

    res.json({error: "", data: updatedData});
  }

});

app.get('/get_unique_chips', async (req: Request, res: Response) => {
  console.log("called: get unique chips")

  const response = await get_unique_chips()

  res.json(response)
    
});

app.get('/add_view', async (req: Request, res: Response) => {})

app.get('/create_article', async (req: Request, res: Response) => {

  console.log("called: create_article")

  await create_article(req.query)

  await res.status(res.statusCode).json({ error: "" });
})

app.get('/get_article_meta', async (req: Request, res: Response) => {

  console.log("called: get_article_meta")

  const {articlesrc} = req.query

  const article = await get_article(articlesrc)

  if (article.length === 0) res.status(404).json({ error: 'Article not found' });

  res.json(article[0])

})

app.get('/loggedIn', protectedRouter, async (req: Request, res: Response) => {
  console.log("user checking if logged in");

  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    console.log(decoded)
    console.log("success");
    res.json({
      data: true,
      error: {
        has_error: false,
        error_message: "",
      }
    })
    return

  } catch (e) {
    console.log("fail");
    res.status(401).json({
      data: false,
      error: {
        has_error: true,
        error_message: "Token has expired",
      }
    })
    return
  }

});

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log("logging in: ", username, password)

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
      console.log("Password invalid")
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log("creating token")
    const token = await jwt.sign({ userId: user.id }, process.env.SECRETKEY, { expiresIn: '1h' });
    console.log("creatied token")

    res.json({ token });
  } catch(error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

})

app.post('/signup', async (req: Request, res: Response) => {
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
app.get('/secure/get_all_articles', async (req: Request, res: Response) => {

  
  // Grab and return the articles
  const articles = await get_all_articles()

  const return_val:api_return_schema<article> = {data: articles, error:{has_error:false, error_message:""}}

  res.json(return_val);
})



app.get('/secure/get_all_categories', async (req: Request, res: Response)  => {

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    return {data: [], has_error: true, error_message: `${res.status(result.errorcode).json({ error: result.message })}`};
  }
  
  const { data, error: { has_error, error_message }}:api_return_schema<category> = await get_all_categories()

  res.json({data, error: { has_error, error_message } });
})

app.post('/secure/delete_category', async (req: Request, res: Response) => {

  const given_category: category = req.body.category_stringified as category;

  // Perform operations like DeleteCategory(category)
  const result: api_return_schema<Boolean> = await DeleteCategory(given_category);

  if (result.error.has_error) res.status(500).json(result)

  res.status(200).json(result)

});

app.post('/secure/add_category', async (req: Request, res: Response) => {
  // req.body will now contain parsed fields
  console.log("Received data:", req.body);

  const { category_name } = req.body;

  const result: api_return_schema<Boolean> = await add_category(category_name)

  if (result.error.has_error) res.status(500).json(result)

  res.status(200).json(result)

});

/**
 * Upload a new chip with a name, description and image
 */
app.post('/secure/upload_chip', upload.single('image'), async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const image: any = req.file;

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    return res.status(result.errorcode).json({ error: result.message });
  }

  /**
   * Check that this tag doesn't already exist in the DB
   */
  const foundChips = await get_chip(name)

  if (foundChips.length > 0) {
    // If it already exists in the DB return early
    return res.status(500).json({ message: 'An error occurred while uploading the image' });
  }

  // Put the chip into the DB
  await add_chip(name, description)

  // Generate the path where we'll write the svg
  const imagePath = path.join(svg_dir, name+".svg");
  
  // WRite the file from the buffer into the CMS
  fs.writeFile(imagePath, image.buffer, (error:any) => {
    if (error) {
      console.error('Error writing the image file:', error);
      return res.status(500).json({ message: 'An error occurred while uploading the image' });
    }

    res.status(200).json({ message: 'Chip uploaded successfully' });
  });
})

/**
 * Edit a chip with a name, description and image
 */
app.post('/secure/edit_chip', upload.single('image'), async (req: Request, res: Response) => {
  const { name, description, original_name } = req.body;
  const image = req.file;

  console.log(name, description, original_name)

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    return res.status(result.errorcode).json({ error: result.message });
  }

  /**
   * Check that this tag doesn't already exist in the DB
   */
  const foundChips = await get_chip(original_name)

  const id = foundChips[0]._id

  if (foundChips.length == 0) {
    console.log("did not find chips. Quitting")
    // If it already exists in the DB return early
    return res.status(500).json({ message: 'An error occurred while uploading the image' });
  }

  if (image){
    // Generate the path where we'll write the svg
    const imagePath = path.join(svg_dir, name+".svg");

    // Write the file from the buffer into the CMS
    fs.writeFile(imagePath, image.buffer, (error: any) => {
      if (error) {
        console.error('Error writing the image file:', error);
        return res.status(500).json({ message: 'An error occurred while uploading the image' });
      }
    });
  }
  else {
    const old_image_path = path.join(svg_dir, original_name+".svg");
    const new_image_path = path.join(svg_dir, name+".svg");
    try {
      fs.renameSync(old_image_path, new_image_path);
      console.log('File renamed successfully');
    } catch (err) {
      console.error('Error renaming file:', err);
    }
  }

  // Put the chip into the DB
  await edit_chip(id, name, description)
  res.status(200).json({ message: 'Chip uploaded successfully' });
})

/**
 * Upload a new chip with a name, description and image
 */
app.post('/secure/update_article', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mdx', maxCount: 1 }, { name: 'best_mdx', maxCount: 1 }]), async (req: Request, res: Response) => {
  const { databaseID, title, desc, category, infoText, chips, source, views, type, publishDate, ready, portfolioReady} = req.body;

  if (!req.files || Array.isArray(req.files)) {
    throw new Error('No files uploaded');
  }

  const imageFile: any = req.files['image'] ? req.files['image'][0] : undefined;
  const mdxFile: any = req.files['mdx'] ? req.files['mdx'][0] : undefined;
  const bestpart_mdxFile: any = req.files['best_mdx'] ? req.files['best_mdx'][0] : undefined;

  console.log("\n\n\n\n\ncalled update articles")
  console.log(databaseID, title, desc, category, infoText, chips, source, views, publishDate, ready, portfolioReady, type)

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    return res.status(result.errorcode).json({ error: result.message });
  }

  try {

    if (mdxFile) console.log("got mdx")
    if (bestpart_mdxFile) console.log("got best part mdx")

    // Update the article
    const update_result = await updatedArticle(req.body)

    const update_result2 = await add_category(category)

    if (mdxFile) {
      const mdxPath = path.join(DATA_DIR, "CMS", "articles", source, "article.mdx");
      await fs.writeFileSync(mdxPath, mdxFile.buffer);
    }

    if (bestpart_mdxFile) {
      const mdxPath = path.join(DATA_DIR, "CMS", "articles", source, "bestpart_article.mdx");
      await fs.writeFileSync(mdxPath, bestpart_mdxFile.buffer);
    }

    if (imageFile) {
      const imagePath = path.join(DATA_DIR, "CMS", "articles", source, "container.png");
      await fs.writeFileSync(imagePath, imageFile.buffer);
    }

    res.status(200).json({ message: 'Chip uploaded successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred during the operation' });
  }
})

app.get('/secure/add_unpublished_article', async (req: Request, res: Response) => {

  console.log("\n\n\n\nbreakdown")

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    return res.status(result.errorcode).json({ error: result.message });
  }

  try {
    const entry = await add_article();

    const new_dir_path = path.join(DATA_DIR, "CMS", "articles", entry.source)

    console.log(new_dir_path)

    console.log("creating dir")
    await fss.mkdir(new_dir_path);
    console.log("creatied dir")

    res.status(200).json({ message: 'Chip uploaded successfully' });
  }
  catch {
    res.status(500).json({ message: 'Failed' });
  }

})

app.post('/secure/delete_article', async (req: Request, res: Response) => {
  const { databaseID, source } = req.body;
  
  console.log("Jason ", databaseID, source)

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    return res.status(result.errorcode).json({ error: result.message });
  }

  try {
    console.log("look")
    await deleteArticle(databaseID);
    await fs.rm(path.join(DATA_DIR, "CMS", "articles", source), {recursive: true});

    res.status(200).json({ message: 'Chip uploaded successfully' });
  }
  catch {
    res.status(500).json({ message: 'Failed' });
  }
})

app.post('/secure/delete_chip', async (req: Request, res: Response) => {
  const { name } = req.body;

  console.log("name: ", name)

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    return res.status(result.errorcode).json({ error: result.message });
  }

  try {
    /**
     * Check that this tag doesn't already exist in the DB
     */
    const foundChips = await get_chip(name)

    const id = foundChips[0]._id

    if (foundChips.length == 0) {
      console.log("did not find chips. Quitting")
      // If it already exists in the DB return early
      return res.status(500).json({ message: 'An error occurred while uploading the image' });
    }

    await deleteChip(id);

    res.status(200).json({ message: 'Chip uploaded successfully' });
  }
  catch {
    res.status(500).json({ message: 'Failed' });
  }
})

// app.post('/secure/remove_chips', async (req: Request, res: Response) => {
//   const { articles, chips_to_remove } = req.body;

//   const result = await validate_JWT(req.cookies.token)

//   if (!result.success) {
//     return res.status(result.errorcode).json({ error: result.message });
//   }

//   try {

//     // Update the article
//     const update_result = await updatedArticle(req.body)

//     if (mdxFile) {
//       const mdxPath = path.join(DATA_DIR, "CMS", "articles", source, "article.mdx");
//       fs.writeFileSync(mdxPath, mdxFile.buffer);
//     }

//     if (imageFile) {
//       const imagePath = path.join(DATA_DIR, "CMS", "articles", source, "container.png");
//       fs.writeFileSync(imagePath, imageFile.buffer);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'An error occurred during the operation' });
//   }

// })

app.use(`/CMS/articles/`, express.static(path.join(DATA_DIR, 'CMS', 'articles')));
app.use('/TAG_SVGS/', express.static(path.join(DATA_DIR, 'TAG_SVGS')));
app.use('/image/', express.static(path.join(DATA_DIR, 'image')));

app.get(`/favicon`, async (req: Request, res: Response) => {
    const { href }: any = req.query;
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