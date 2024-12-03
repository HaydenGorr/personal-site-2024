import { app } from "../express";
import { api_return_schema, category } from "../interfaces/interfaces";
import { get_all_categories, DeleteCategory, AddCategory } from "../utils/mongo_utils/category";
import { Response, Request } from "express";


app.get('/secure/get_all_categories', async (req: Request, res: Response)  => {

    const mongo_api_response: api_return_schema<category[]> = await get_all_categories();
  
    if (mongo_api_response.error.has_error) { 
      res.status(500).json(mongo_api_response)
      return
    }
  
    res.status(200).json(mongo_api_response);
  })
  
  app.post('/secure/delete_category', async (req: Request, res: Response) => {
  
    const given_category: category = req.body.category_stringified as category;
  
    // Perform operations like DeleteCategory(category)
    const result: api_return_schema<Boolean> = await DeleteCategory(given_category);
  
    if (result.error.has_error) {res.status(500).json(result); return;}
  
    res.status(200).json(result)
  
  });
  
  app.post('/secure/add_category', async (req: Request, res: Response) => {
  
    try{
      const { category_name } = req.body;
  
      const result: api_return_schema<Boolean> = await AddCategory(category_name)
  
      if (result.error.has_error) {res.status(500).json(result); return}
  
      res.status(200).json(result)
    } catch {
      res.status(500).json({data:[], error:{has_error: true, error_msg: "Internal Server Error"}})
      return
    }
  
  
  });