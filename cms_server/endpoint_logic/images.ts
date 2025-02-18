import { app } from "../express.js";
import { SaveFileToRandomDir } from "../utils/save_image_to_drive.js";
import { add_image, delete_image, get_selected_images } from "../utils/mongo_utils/images.js";
import { api_return_schema } from "../interfaces/misc_interfaces.js";
import { db_image, image } from "../interfaces/image_interfaces.js";
import { file_on_drive } from "../interfaces/misc_interfaces.js";
import { get_all_images } from "../utils/mongo_utils/images.js";
import { Response, Request } from "express";
import { upload } from "../express.js";

app.get('/secure/get_all_images', async (req: Request, res: Response)  => {

  const category: string | null = req.query.category as string ?? null;

  const mongo_api_response: api_return_schema<db_image[]> = await get_all_images(category ?? undefined);

  if (mongo_api_response.error.has_error) { 
    res.status(500).json(mongo_api_response)
    return
  }

  res.status(200).json(mongo_api_response);
  return
})


app.get('/secure/select_images', async (req: Request, res: Response)  => {

  const filter_raw: Partial<db_image>[] | Partial<db_image> = req.query;
  var filter: Partial<db_image>[] = [];

  if (!Array.isArray(filter_raw)) filter.push(filter_raw)
  else filter = filter_raw

  if (!filter) {
    res.status(500).json("not passed a partial db_image object")
    return
  }

  const mongo_api_response: api_return_schema<db_image[]> = await get_selected_images(filter);

  if (mongo_api_response.error.has_error) { 
    res.status(500).json(mongo_api_response)
    return
  }

  res.status(200).json(mongo_api_response);
  return
})

  
app.post('/secure/delete_image', async (req: Request, res: Response) => {
  
  const given_image: db_image = req.body.image_stringified as db_image;

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

    if (!req.query.category) {
      res.status(400).json({ data:"", error: {has_error: true, error_message: 'No category provided'} });
      return 
    } 

    const file = req.file;
    const category = req.query.category as string

    console.log("category", category)

    const save_file_api: api_return_schema<file_on_drive|null> = await SaveFileToRandomDir(file)

    if (save_file_api.error.has_error) {
      res.status(500).json(save_file_api)
      return
    }

    // Props
    const image_conversion: image = {...save_file_api.data as file_on_drive, category: category}

    const response: api_return_schema<db_image|null> = await add_image(image_conversion)

    if (response.error.has_error){
      res.status(500).json({data:"", error:{has_error: true, error_message: response.error.error_message + "The item was written to drive, but not to database"}})
      return
    }

    res.status(200).json(response)
    return


  } catch {
    res.status(500).json({data:"", error:{has_error: true, error_message: "Internal Server Error"}})
    return
}
    
});