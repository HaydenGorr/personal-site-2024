import { image, api_return_schema } from "../../interfaces/interfaces";
import images_schema from "../../mongo_schemas/images_schema";
import dbConnect from '../db_conn';

export async function get_all_images(): Promise<api_return_schema<image[]>> {

    const connection = await dbConnect(process.env.DB_IMAGES_NAME)

    try {
        const image_search_result: image[] = await images_schema(connection).find();
        return {data: image_search_result, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}


export async function add_image(in_file_name: string): Promise<api_return_schema<Boolean>>{

    const connection = await dbConnect(process.env.DB_IMAGES_NAME)
  
    try {
        const images_model = images_schema(connection);

        const existingImage = await images_model.findOne({ file_name: in_file_name });
        if (existingImage) {
            return { data: false, error: { has_error: true, error_message: "image with this name already exists. Serious issue. Look into this asap" } };
        }

        const newImage = new images_model({
            file_name: in_file_name
        });

        const saved = await newImage.save();

        return {data: true, error:{has_error: false, error_message: ""}};
    } catch (error) {
        return {data: false, error:{has_error: true, error_message: `${error}. Serious issue. Look into this asap`}};
    }

}

export async function delete_image(inImage: image) : Promise<api_return_schema<Boolean>> {
    try {
        console.log("deleting image")
        const connection = await dbConnect(process.env.DB_IMAGES_NAME)
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