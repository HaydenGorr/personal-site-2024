import { app, upload } from "../express";
import { api_return_schema, article } from "../interfaces/interfaces"
import { Request, Response } from 'express';
import { get_all_ready_articles, create_article, get_all_articles, add_article, delete_article } from "../utils/mongo_utils/article";
import { updatedArticle, get_article } from "../utils/mongo_utils/article";
import { AddCategory } from "../utils/mongo_utils/category";
import fs from 'fs'
import path from "path";
import { DATA_DIR } from "../utils/path_consts";
import { promises as fss } from 'fs';

app.get('/get_all_ready_articles', async (req: Request, res: Response) => {

    console.log("getting all articles marked ready")

    const response = await get_all_ready_articles()

    // console.log(`${response.data.length} ready articles retrieved`)
    console.log(response)

    res.json(response);

});

app.get('/create_article', async (req: Request, res: Response) => {

    console.log("called: create_article")

    await create_article(req.query)

    await res.status(res.statusCode).json({ error: "" });

})


app.get('/secure/get_all_articles', async (req: Request, res: Response) => {

    // Grab and return the articles
    var articles: api_return_schema<article[]> = await get_all_articles()

    if (articles.error.has_error) {res.status(500).json(articles); return}

    // articles.data = articles.data.map((article_obj: any) => {
    //   return { ...article_obj.toObject(), hasImage: hasContainerPng(article_obj.source) };
    // });

    res.status(200).json(articles);

})



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

  app.get('/get_article_meta', async (req: Request, res: Response) => {

    console.log("called: get_article_meta")
  
    const {articlesrc} = req.query
  
    const article = await get_article(articlesrc as string)
  
    if (article.length === 0) res.status(404).json({ error: 'Article not found' });
  
    res.json(article[0])
  
  })


  app.get('/secure/add_unpublished_article', async (req: Request, res: Response) => {

    try {
      const entry: api_return_schema<article|null> = await add_article();
  
      if (entry.error.has_error) throw Error("Could not find article")
  
      const new_dir_path = path.join(DATA_DIR, "CMS", "articles", entry.data!.source as string)
  
      await fss.mkdir(new_dir_path);
  
      res.status(200).json({ message: 'Chip uploaded successfully' });
    }
    catch {
      res.status(500).json({ message: 'Failed' });
    }
  
  })
  app.post('/secure/delete_article', async (req: Request, res: Response) => {
    const { databaseID, source } = req.body;
  
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