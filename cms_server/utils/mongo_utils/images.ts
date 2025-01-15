import { api_return_schema } from "../../interfaces/misc_interfaces.js";
import { db_image, image } from "../../interfaces/image_interfaces.js";
import images_schema from "../../mongo_schemas/images_schema.js";
import dbConnect from '../db_conn.js';
import { FilterQuery } from "mongoose";

export async function get_all_images(category?: string): Promise<api_return_schema<db_image[]>> {

    const connection = await dbConnect(process.env.DB_PRIME_NAME)

    try {

        const query = category ? { category: category } : {};
        const image_search_result: db_image[] = await images_schema(connection)
            .find(query)
            .sort({ upload_date: -1 });

        return {data: image_search_result, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}

export async function get_selected_images(filter: Partial<db_image>[]): Promise<api_return_schema<db_image[]>> {

    const connection = await dbConnect(process.env.DB_PRIME_NAME)

    try {

        let mongoQuery: Record<string, any>

        if (Array.isArray(filter)) {
          // If filter is an array, use it as an OR condition
          mongoQuery = { $or: filter }
        } else {
          // Otherwise, just use the single filter object
          mongoQuery = filter
        }

        const entries: db_image[] = await images_schema(connection).find(mongoQuery);

        return {data: entries, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}

export async function add_image(file: image): Promise<api_return_schema<db_image|null>>{

    const connection = await dbConnect(process.env.DB_PRIME_NAME)
  
    try {
        const images_model = images_schema(connection);

        const existingImage = await images_model.findOne({ file_name: file.file_name });
        if (existingImage) {
            return { data: null, error: { has_error: true, error_message: "image with this name already exists. Serious issue. Look into this asap" } };
        }

        const newImage = new images_model({
            file_name: file.file_name,
            full_url: file.full_url,
            category: file.category,
            upload_date: new Date()
        });

        const saved = await newImage.save();

        return {data: {...file, _id: saved._id}, error:{has_error: false, error_message: ""}};
    } catch (error) {
        return {data: null, error:{has_error: true, error_message: `${error}. Serious issue. Look into this asap`}};
    }

}

export async function delete_image(inImage: db_image) : Promise<api_return_schema<Boolean>> {
    try {
        console.log("deleting image")
        const connection = await dbConnect(process.env.DB_PRIME_NAME)
        const Image = await images_schema(connection);
        const result = await Image.findByIdAndDelete(inImage._id);
        
        if (!result) {
            return { 
                data: false,
                error:{
                    has_error: true,
                    error_message: `Could not find the Image in the backend with id ${inImage._id}`
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