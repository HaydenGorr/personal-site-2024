import { app, upload } from "../express";
import { Request, Response } from "express";
import { SaveFileToRandomDir } from "../utils/save_image_to_drive";
import { api_return_schema, image_on_drive } from "../interfaces/interfaces";
import { add_image } from "../utils/mongo_utils/images";

app.get('/add_view', async (req: Request, res: Response) => {})

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
