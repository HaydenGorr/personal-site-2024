import { app } from "../express";
import { SaveFileToRandomDir } from "../utils/save_image_to_drive";
import { add_image, delete_image } from "../utils/mongo_utils/images";
import { api_return_schema, image, image_on_drive } from "../interfaces/interfaces";
import { get_all_images } from "../utils/mongo_utils/images";
import { Response, Request } from "express";
import { upload } from "../express";

app.get('/secure/get_all_images', async (req: Request, res: Response)  => {
  const mongo_api_response: api_return_schema<image[]> = await get_all_images();

  if (mongo_api_response.error.has_error) { 
    res.status(500).json(mongo_api_response)
    return
  }

  res.status(200).json(mongo_api_response);
  return
})

  
app.post('/secure/delete_image', async (req: Request, res: Response) => {
  
  const given_image: image = req.body.image_stringified as image;

  // Perform operations like DeleteCategory(category)
  const result: api_return_schema<Boolean> = await delete_image(given_image);

  if (result.error.has_error) {res.status(500).json(result); return;}

  console.log("deleted")
  res.status(200).json(result)

});

app.post('/secure/upload_image', upload.single('image'), async (req: Request, res: Response) => {

  try {
    if (!req.file) {
        res.status(400).json({ data:"", error: {has_error: true, error_message: 'No image file provided'} });
        return 
    }

    console.log("got file")

    const file = req.file;
  
    const save_file_api: api_return_schema<image_on_drive|null> = await SaveFileToRandomDir(file)

    if (save_file_api.error.has_error) {
      res.status(500).json(save_file_api)
      return
    }

    await add_image(save_file_api.data!.filename)

    res.status(200).json(save_file_api)
    return


  } catch {
    res.status(500).json({data:"", error:{has_error: true, error_message: "Internal Server Error"}})
    return
}
    
});