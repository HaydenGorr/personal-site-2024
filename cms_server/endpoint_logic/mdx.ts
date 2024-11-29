import { app } from "../express";
import { Response, Request } from "express";
import { api_return_schema, mdx_on_drive, mdx, file_on_drive } from "../interfaces/interfaces";
import { SaveStringToRandomDir } from "../utils/save_image_to_drive";
import { add_mdx, get_all_mdx } from "../utils/mongo_utils/mdx";

app.post('/secure/upload_mdx', async (req: Request, res: Response) => {

    try {

        const { mdx_string } = req.body;

        console.log(mdx_string)

        if (mdx_string.length == 0) {
            res.status(500).json({data:"", error:{has_error: true, error_message: "No text recieved"}})
        }

        const save_file_api: api_return_schema<file_on_drive|null> = await SaveStringToRandomDir(mdx_string)

        if (save_file_api.error.has_error) {
            res.status(500).json(save_file_api)
            return
        }

        const response: api_return_schema<mdx_on_drive|null> = await add_mdx(save_file_api.data as file_on_drive)

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

app.get('/secure/get_all_mdx', async (req: Request, res: Response)  => {
    const mongo_api_response: api_return_schema<mdx[]> = await get_all_mdx();
  
    if (mongo_api_response.error.has_error) { 
      res.status(500).json(mongo_api_response)
      return
    }
  
    res.status(200).json(mongo_api_response);
    return
})