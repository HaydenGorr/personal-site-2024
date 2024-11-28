import { app, upload } from "../express";
import { Request, Response } from "express";
import { SaveFileToRandomDir } from "../utils/save_image_to_drive";

app.get('/add_view', async (req: Request, res: Response) => {})

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
