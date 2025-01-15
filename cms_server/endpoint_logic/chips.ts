import { app, upload } from "../express.js";
import { Request, Response } from "express";
import { api_return_schema } from "../interfaces/misc_interfaces.js";
import { db_chip, chip } from "../interfaces/chip_interfaces.js";
import { svg_dir } from "../utils/path_consts.js";
import path from "path";
import fs from 'fs'
import { AddChip, DeleteChip, get_chip, get_unique_chips } from "../utils/mongo_utils/chips.js";


app.get('/get_all_chips', async (req: Request, res: Response) => {

  const response: api_return_schema<db_chip[]> = await get_unique_chips()

  if (response.error.has_error) {res.status(500).json(response); return}

  res.status(200).json(response)
    
});

app.post('/secure/delete_chip', async (req: Request, res: Response) => {
  
  const given_chip: db_chip = req.body.chip_stringified as db_chip;

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