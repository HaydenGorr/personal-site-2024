import { api_return_schema } from "../../interfaces/misc_interfaces.js";
import { db_mdx } from "../../interfaces/mdx_interfaces.js";
import { file_on_drive } from "../../interfaces/misc_interfaces.js";
import { db_image } from "../../interfaces/image_interfaces.js";
import mdx_schema from "../../mongo_schemas/mdx_schema.js";
import images_schema from "../../mongo_schemas/images_schema.js";
import dbConnect from '../db_conn.js';
import { assert } from "console";
import { Types } from "mongoose";

export async function add_mdx(inFile: file_on_drive, title: string, snippet: string, image_database_entries: db_image[]): Promise<api_return_schema<string>>{

    const connection = await dbConnect(process.env.DB_PRIME_NAME)

    try {
        const mdx_model = mdx_schema(connection);

        const existingImage = await mdx_model.findOne({ file_name: inFile.file_name });
        if (existingImage) {
            return { data: "", error: { has_error: true, error_message: "image with this name already exists. Serious issue. Look into this asap" } };
        }

        const new_mdx = new mdx_model({
            title: title,
            file_name: inFile.file_name,
            full_url: inFile.full_url,
            images: image_database_entries,
            snippet: snippet,
            version_history: new Date(),
            edit_date: new Date(),
        });

        const saved = await new_mdx.save();

        return {data: `${saved}`, error:{has_error: false, error_message: ""}};
    } catch (error) {
        return {data: "", error:{has_error: true, error_message: `${error}. Serious issue. Look into this asap`}};
    }

}
export async function get_all_mdx(): Promise<api_return_schema<any[]>> {

    const connection = await dbConnect(process.env.DB_PRIME_NAME)
    images_schema(connection) // Register iamges_schema so it can be used in the query below

    try {
        // CHANGE ANY[]
        const search_result: any[] = await mdx_schema(connection).find().populate('images');
        const converted: db_mdx[] = search_result;

        return {data: converted, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}

export async function get_selected_mdx(filter: Partial<db_mdx>): Promise<api_return_schema<db_mdx[]>> {

    const connection = await dbConnect(process.env.DB_PRIME_NAME)
    images_schema(connection)
    try {
        const entries: any[] = await mdx_schema(connection).find(filter).populate('images');
        const converted: db_mdx[] = entries;

        console.log("converted", converted)

        return {data: converted, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}

export async function update_mdx(
    _id: string,
    mdx_file: file_on_drive,
    title: string,
    snippet: string,
    image_database_entries: db_image[]
  ): Promise<api_return_schema<db_mdx | null>> {
    const connection = await dbConnect(process.env.DB_PRIME_NAME);
    images_schema(connection);
  
    try {
      const entries = await mdx_schema(connection).findOneAndUpdate(
        { _id },
        {
          title,
          file_name: mdx_file.file_name,
          full_url: mdx_file.full_url,
          images: image_database_entries,
          snippet,
          version_history: new Date(),
          edit_date: new Date(),
        },
        { new: true }
      ) as db_mdx;
  
      assert(entries, 'No entries found');
  
      return {
        data: entries,
        error: { has_error: false, error_message: '' },
      };
    } catch (error) {
      return {
        data: null,
        error: { has_error: true, error_message: `${error}` },
      };
    }
}
 
export async function delete_mdx(_id: string | Types.ObjectId) : Promise<api_return_schema<Boolean>> {
    try {
      const connection = await dbConnect(process.env.DB_PRIME_NAME)
      const result = await mdx_schema(connection).findByIdAndDelete(_id)

      if (!result) {
          return { 
              data: false,
              error:{
                  has_error: true,
                  error_message: `Could not find the Chip in the backend with id ${_id}`
              }
          };
      }
      return { 
          data: true,
          error:{
              has_error: false,
              error_message: ``
          }
      };
    } catch (error: any) {
        return { 
            data: false,
            error:{
                has_error: true,
                error_message: `Error connecting to database. ${error}`
            }
        };
    }
}