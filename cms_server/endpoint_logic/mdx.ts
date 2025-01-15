import { app } from "../express.js";
import { Response, Request } from "express";
import { api_return_schema, mdx, file_on_drive, image, db_obj } from "../interfaces/interfaces.js";
import { db_image } from "../interfaces/image_interfaces.js";
import { SaveStringToRandomDir, OverwriteFile } from "../utils/save_image_to_drive.js";
import { add_mdx, get_all_mdx, update_mdx } from "../utils/mongo_utils/mdx.js";
import { find_image_links_in_mdx } from "../utils/find_image_links_in_mdx.js";
import { get_selected_images } from "../utils/mongo_utils/images.js";
import { get_selected_mdx, delete_mdx } from "../utils/mongo_utils/mdx.js";
import { db_mdx } from "../interfaces/mdx_interfaces.js";

app.post('/secure/upload_mdx', async (req: Request, res: Response) => {

    try {

        const { mdx_string, title} = req.body;

        const image_urls: {}[] = find_image_links_in_mdx(mdx_string).map((val, index) => {return {full_url: val}})
        const image_entries: api_return_schema<db_image[]> = await get_selected_images(image_urls)

        console.log("image_entries", image_entries)

        const snippet = mdx_string.slice(0, 100);

        if (image_entries.data.length != image_urls.length) {
            console.log("WARNING. Some images were not found in the database")
        }

        if (mdx_string.length == 0) {
            res.status(500).json({data:"", error:{has_error: true, error_message: "No text recieved"}})
            return
        }

        // Save the mdx file to the drive
        const save_file_api: api_return_schema<file_on_drive|null> = await SaveStringToRandomDir(mdx_string)

        if (save_file_api.error.has_error) {
            res.status(500).json(save_file_api)
            return
        }

        // Save the mdx entry to the database
        const response: api_return_schema<mdx|null> = await add_mdx(save_file_api.data as file_on_drive, title, snippet, image_entries.data)

        if (response.error.has_error){
            res.status(500).json({data:"", error:{has_error: true, error_message: response.error.error_message}})
            return
        }

        res.status(200).json(response)
        return


    } catch {
        res.status(500).json({data:"", error:{has_error: true, error_message: "Internal Server Error"}})
        return
    }
})

app.post('/secure/update_mdx', async (req: Request, res: Response) => {

    try {

        const { mdx_string, title, _id} = req.body;

        if (mdx_string.length == 0 || title.length == 0 || _id.length == 0) {
            res.status(500).json({data:"", error:{has_error: true, error_message: "missing mdx, title, or id recieved"}})
            return
        }

        //** Find the images references inside the mdx by url and find their database entries
        // This is because we need to store their databaseID in this mdx_entry */
        const image_urls: {}[] = find_image_links_in_mdx(mdx_string).map((val, index) => {return {full_url: val}})
        // Get images from db
        const image_entries: api_return_schema<db_image[]> = await get_selected_images(image_urls)

        console.log("image_entries", image_entries)

        /**
         * Get the snippet by just slicing the first 100 chars off the body text
         */
        const snippet = mdx_string.slice(0, 100);

        /**
         * Save the file to the drive
         */
        const save_file_api: api_return_schema<file_on_drive|null> = await SaveStringToRandomDir(mdx_string)

        if (save_file_api.error.has_error) {
            res.status(500).json(save_file_api)
            return
        }
        
        /**
         * Update the mdx record in the DB
         */
        const response: api_return_schema<mdx|null> = await update_mdx(_id, save_file_api.data as file_on_drive, title, snippet, image_entries.data)

        if (response.error.has_error){
            console.log("error")
            res.status(500).json({data:"", error:{has_error: true, error_message: response.error.error_message}})
            return
        }

        res.status(200).json(response)
        return


    } catch {
        res.status(500).json({data:"", error:{has_error: true, error_message: "Internal Server Error"}})
        return
    }
})

app.get('/secure/get_all_mdx', async (req: Request, res: Response)  => {
    const mongo_api_response: api_return_schema<mdx[]> = await get_all_mdx();
  
    if (mongo_api_response.error.has_error) { 
      res.status(500).json(mongo_api_response)
      return
    }
  
    res.status(200).json(mongo_api_response);
    return
})

app.get('/secure/select_mdx', async (req: Request, res: Response)  => {

    const filter: Partial<db_mdx> = req.query;
  
    if (!filter) {
      res.status(500).json("not passed a partial db_image object")
      return
    }

    console.log("mdxxxx", filter)
  
    const mongo_api_response: api_return_schema<db_mdx[]> = await get_selected_mdx(filter);
  
    if (mongo_api_response.error.has_error) { 
      res.status(500).json(mongo_api_response)
      return
    }
  
    res.status(200).json(mongo_api_response);
    return
  })

app.post('/secure/delete_mdx', async (req: Request, res: Response)  => {

    const id: string = req.body.id as string;
    console.log(id)

    if (!id) {
        res.status(500).json("did not provide mdx id")
        return
    }

    const mongo_api_response: api_return_schema<Boolean> = await delete_mdx(id);
  
    if (mongo_api_response.error.has_error) { 
      res.status(500).json(mongo_api_response)
      return
    }
  
    res.status(200).json(mongo_api_response);
    return
  })