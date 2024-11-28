import { app, upload } from "../express";
import { Request, Response } from "express";
import { get_unique_chips, get_chip, get_chips, add_chip, EditChip, DeleteChip } from "../utils/mongo_utils/chips";
import { api_return_schema, chip } from "../interfaces/interfaces";
import { svg_dir } from "../utils/path_consts";
import path from "path";
import fs from 'fs'

app.get('/get_unique_chips', async (req: Request, res: Response) => {
    console.log("called: get unique chips")
  
    const response = await get_unique_chips()
  
    res.json(response)
      
  });
  

  app.get('/get_all_chips', async (req: Request, res: Response) => {

    const response: api_return_schema<chip[]> = await get_unique_chips()
  
    if (response.error.has_error) {res.status(500).json(response); return}
  
    res.status(200).json(response)
      
  });


  /**
 * Upload a new chip with a name, description and image
 */
app.post('/secure/upload_chip', upload.single('image'), async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const image: any = req.file;
  
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


  app.post('/secure/edit_chip', upload.single('image'), async (req: Request, res: Response) => {
    const { name, description, original_name } = req.body;
    const image = req.file;
  
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


  app.post('/secure/delete_chip', async (req: Request, res: Response) => {
    const { name } = req.body;
  
    console.log("name: ", name)

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