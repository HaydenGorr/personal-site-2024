import dotenv from 'dotenv';
import express, { NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import path from 'path';


// Configure dotenv first
dotenv.config({ path: process.env.ENV_FILE });

const app = express();
const PORT: number = parseInt(process.env.PORT!, 10);

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import { validate_JWT } from './utils/validate_JWT';
import multer from 'multer';

import { DATA_DIR, svg_dir } from './utils/path_consts';

import { promises as fss } from 'fs';
import fs from 'fs';

import { add_user, get_users_by_username } from './utils/mongo_utils/admin_user';
import { delete_article, add_article, updatedArticle, get_all_articles, get_article, get_all_ready_articles, create_article } from "./utils/mongo_utils/article";
import { DeleteChip, EditChip, add_chip, get_chips, get_unique_chips, get_chip } from "./utils/mongo_utils/chips";
import { get_all_categories, DeleteCategory } from "./utils/mongo_utils/category";
import { AddCategory } from "./utils/mongo_utils/category";

import { api_return_schema, article, category, chip, user } from "./interfaces/interfaces"
import { Request, Response } from 'express';
import { SaveFileToRandomDir } from "./utils/save_image_to_drive";
import { error } from 'console';


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const allowedOrigins = ['http://localhost:3000', 'https://www.haydengorringe.com', 'http://localhost:3004'];

const JWTMiddleware: RequestHandler = (req: Request, res: Response, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("User did not provide a token");
    res.status(401).json({
      data: false,
      error: {
        has_error: true,
        error_message: "User did not provide a token",
      }
    });
    return; // Exit the function without returning a value
  }

  // Handle the asynchronous operation
  validate_JWT(token)
    .then(() => {
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
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

// app.get('/get_all_ready_portfolio_articles', async (req: Request, res: Response) => {

//   console.log("getting all portfolio articles marked ready")

//   var response = await get_all_ready_portfolio_articles()

//   for (let i = 0; i < response.data.length; i++) {
//     if (await check_if_best_article_exists(response.data[i].source)) {
//       response.data[i]["has_best_article"] = true
//     }
//   }

//   console.log(response.data)

//   if (response.error){
//     res.json(response);
//   }
//   else {
//     const updatedData = await Promise.all(response.data.map(async (article: any) => {
//       const hasBestArticle = await check_if_best_article_exists(article.source);
//       return { ...article._doc, has_best_article: hasBestArticle };
//     }));

//     res.json({error: "", data: updatedData});
//   }

// });

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

  const article = await get_article(articlesrc as string)

  if (article.length === 0) res.status(404).json({ error: 'Article not found' });

  res.json(article[0])

})

app.get('/loggedIn', protectedRouter, async (req: Request, res: Response) => {
  console.log("user checking if logged in");

  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.SECRETKEY as string);
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

  const users: api_return_schema<user[]> = await get_users_by_username(username)

  console.log("got users: ", users)

  if (users.data.length === 0) {
    console.log("no users found.")
    res.status(401).json({ error: 'Invalid credentials' });
    return
  }

  const user: user = users.data[0] as user;

  try {
    console.log("validate password")
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("validated")

    if (!isPasswordValid) {
      console.log("Password invalid")
      res.status(401).json({ error: 'Invalid credentials' });
      return 
    }

    console.log("creating token")
    const token = await jwt.sign({ userId: user._id }, process.env.SECRETKEY as string, { expiresIn: '1h' });
    console.log("created token")

    res.json({ token });
    return 
  } catch(error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return 
  }
});

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
  var articles: api_return_schema<article[]> = await get_all_articles()

  if (articles.error.has_error) {res.status(500).json(articles); return}

  // articles.data = articles.data.map((article_obj: any) => {
  //   return { ...article_obj.toObject(), hasImage: hasContainerPng(article_obj.source) };
  // });

  res.status(200).json(articles);
})

app.get('/secure/get_all_categories', async (req: Request, res: Response)  => {

  const mongo_api_response: api_return_schema<category[]> = await get_all_categories();

  if (mongo_api_response.error.has_error) { res.status(500).json(mongo_api_response)}

  res.status(200).json(mongo_api_response);
})

app.post('/secure/delete_category', async (req: Request, res: Response) => {

  const given_category: category = req.body.category_stringified as category;

  // Perform operations like DeleteCategory(category)
  const result: api_return_schema<Boolean> = await DeleteCategory(given_category);

  if (result.error.has_error) {res.status(500).json(result); return;}

  res.status(200).json(result)

});

app.post('/secure/add_category', async (req: Request, res: Response) => {

  try{
    const { category_name } = req.body;

    const result: api_return_schema<Boolean> = await AddCategory(category_name)

    if (result.error.has_error) {res.status(500).json(result); return}

    res.status(200).json(result)
  } catch {
    res.status(500).json({data:[], error:{has_error: true, error_msg: "Internal Server Error"}})
    return
  }


});

app.get('/get_all_chips', async (req: Request, res: Response) => {

  const response: api_return_schema<chip[]> = await get_unique_chips()

  if (response.error.has_error) {res.status(500).json(response); return}

  res.status(200).json(response)
    
});

app.post('/secure/upload_image', upload.single('image'), async (req: Request, res: Response) => {

  console.log("Inside upload image")

  try {
    if (!req.file) {
        res.status(400).json({ data:"", error: {has_error: true, error_message: 'No image file provided'} });
        return 
    }

    console.log("got file")

    const file = req.file;
  
    const file_path: string = await SaveFileToRandomDir(file)

    if (file_path=="") {
      res.status(500).json({data:"", error:{has_error: true, error_message: "could not save to drive"}})
      return
    }

    res.status(200).json({data:file_path, error:{has_error: false, error_message: ""}})
    return


  } catch {
    res.status(500).json({data:"", error:{has_error: true, error_message: "Internal Server Error"}})
    return
}
    
});



/**
 * Upload a new chip with a name, description and image
 */
app.post('/secure/upload_chip', upload.single('image'), async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const image: any = req.file;

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    res.status(result.errorcode).json({ error: result.message });
    return
  }

  /**
   * Check that this tag doesn't already exist in the DB
   */
  const foundChips:api_return_schema<chip[]> = await get_chip(name)

  if (foundChips.data.length > 0) {
    // If it already exists in the DB return early
    res.status(500).json({ message: 'An error occurred while uploading the image' });
    return
  }

  // Put the chip into the DB
  await add_chip(name, description)

  // Generate the path where we'll write the svg
  const imagePath = path.join(svg_dir, name+".svg");
  
  // WRite the file from the buffer into the CMS
  fs.writeFile(imagePath, image.buffer, (error:any) => {
    if (error) {
      console.error('Error writing the image file:', error);
      res.status(500).json({ message: 'An error occurred while uploading the image' });
      return
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
    res.status(result.errorcode).json({ error: result.message });
    return
  }

  /**
   * Check that this tag doesn't already exist in the DB
   */
  const foundChips: api_return_schema<chip[]> = await get_chip(original_name)

  const id = foundChips.data[0]._id as number

  if (foundChips.data.length == 0) {
    console.log("did not find chips. Quitting")
    // If it already exists in the DB return early
    res.status(500).json({ message: 'An error occurred while uploading the image' });
    return
  }

  if (image){
    // Generate the path where we'll write the svg
    const imagePath = path.join(svg_dir, name+".svg");

    // Write the file from the buffer into the CMS
    fs.writeFile(imagePath, image.buffer, (error: any) => {
      if (error) {
        console.error('Error writing the image file:', error);
        res.status(500).json({ message: 'An error occurred while uploading the image' });
        return
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
  await EditChip(id, name, description)
  res.status(200).json({ message: 'Chip uploaded successfully' });
  return
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
    res.status(result.errorcode).json({ error: result.message });
    return
  }

  try {

    if (mdxFile) console.log("got mdx")
    if (bestpart_mdxFile) console.log("got best part mdx")

    // Update the article
    const update_result = await updatedArticle(req.body)

    const update_result2 = await AddCategory(category)

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
    res.status(result.errorcode).json({ error: result.message });
    return
  }

  try {
    const entry: api_return_schema<article|null> = await add_article();

    if (entry.error.has_error) throw error("Could not find article")

    const new_dir_path = path.join(DATA_DIR, "CMS", "articles", entry.data!.source as string)

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
    res.status(result.errorcode).json({ error: result.message });
    return
  }

  try {
    console.log("look")
    await delete_article(databaseID);
    await fs.promises.rm(path.join(DATA_DIR, "CMS", "articles", source), { recursive: true });

    res.status(200).json({ message: 'Chip uploaded successfully' });
    return
  }
  catch {
    res.status(500).json({ message: 'Failed' });
    return
  }
})

app.post('/secure/delete_chip', async (req: Request, res: Response) => {
  const { name } = req.body;

  console.log("name: ", name)

  const result = await validate_JWT(req.cookies.token)

  if (!result.success) {
    res.status(result.errorcode).json({ error: result.message });
    return
  }

  try {
    /**
     * Check that this tag doesn't already exist in the DB
     */
    const foundChips: api_return_schema<chip[]> = await get_chip(name)

    const id:number = foundChips.data[0]._id as number

    if (foundChips.data.length == 0) {
      console.log("did not find chips. Quitting")
      // If it already exists in the DB return early
      res.status(500).json({ message: 'An error occurred while uploading the image' });
      return
    }

    await DeleteChip(id);

    res.status(200).json({ message: 'Chip uploaded successfully' });
    return
  }
  catch {
    res.status(500).json({ message: 'Failed' });
    return
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