import { app, upload } from "../express";
import { Request, Response, Express } from "express";
import { SaveFileToRandomDir } from "../utils/save_image_to_drive";
import { api_return_schema } from "../interfaces/interfaces";

import express from 'express';
import { images_dir } from "../utils/path_consts";
import path from "path";

app.get('/add_view', async (req: Request, res: Response) => {})

app.post('/secure/upload_image', upload.single('image'), async (req: Request, res: Response) => {

  try {
    if (!req.file) {
        res.status(400).json({ data:"", error: {has_error: true, error_message: 'No image file provided'} });
        return 
    }

    console.log("got file")

    const file = req.file;
  
    const file_path: api_return_schema<string|null> = await SaveFileToRandomDir(file)

    if (file_path.error) {
      res.status(500).json(file_path)
      return
    }

    res.status(200).json(file_path)
    return


  } catch {
    res.status(500).json({data:"", error:{has_error: true, error_message: "Internal Server Error"}})
    return
}
    
});

app.use('images/', (req, res, next) => {
  console.log('Accessing image:', req.url);
  console.log('Full path:', path.join(images_dir, req.url));
  next();
}, express.static(images_dir));

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
