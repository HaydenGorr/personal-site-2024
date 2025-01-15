import { app } from "../express.js";
import { Request, Response } from "express";

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
