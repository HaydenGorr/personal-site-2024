import { app, upload } from "../express";
import { Request, Response } from "express";
import { api_return_schema, chip } from "../interfaces/interfaces";
import { svg_dir } from "../utils/path_consts";
import path from "path";
import fs from 'fs'
import { AddChip, DeleteChip, get_chip, get_unique_chips } from "../utils/mongo_utils/chips";


app.get('/get_all_chips', async (req: Request, res: Response) => {

  const response: api_return_schema<chip[]> = await get_unique_chips()

  if (response.error.has_error) {res.status(500).json(response); return}

  res.status(200).json(response)
    
});

app.post('/secure/delete_chip', async (req: Request, res: Response) => {
  
  const given_chip: chip = req.body.chip_stringified as chip;

  // Perform operations like DeleteCategory(category)
  const result: api_return_schema<Boolean> = await DeleteChip(given_chip);

  if (result.error.has_error) {res.status(500).json(result); return;}

  res.status(200).json(result)

});

app.post('/secure/add_chip', async (req: Request, res: Response) => {

  try{
    const given_chip: chip = req.body.chip_stringified as chip;

    const result: api_return_schema<Boolean> = await AddChip(given_chip)

    if (result.error.has_error) {res.status(500).json(result); return}

    res.status(200).json(result)
  } catch {
    res.status(500).json({data:[], error:{has_error: true, error_msg: "Internal Server Error"}})
    return
  }


});