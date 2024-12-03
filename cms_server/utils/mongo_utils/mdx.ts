import { api_return_schema, mdx, file_on_drive } from "../../interfaces/interfaces";
import mdx_schema from "../../mongo_schemas/mdx_schema";
import dbConnect from '../db_conn';

export async function add_mdx(inFile: file_on_drive): Promise<api_return_schema<mdx|null>>{

    const connection = await dbConnect(process.env.DB_IMAGES_NAME)
    
    console.log("tyes")

    try {
        const mdx_model = mdx_schema(connection);

        const existingImage = await mdx_model.findOne({ file_name: inFile.file_name });
        if (existingImage) {
            return { data: null, error: { has_error: true, error_message: "image with this name already exists. Serious issue. Look into this asap" } };
        }

        const newImage = new mdx_model({
            file_name: inFile.file_name,
            full_url: inFile.full_url
        });

        const saved = await newImage.save();

        return {data: {...inFile, _id: parseInt(newImage._id.toString()) }, error:{has_error: false, error_message: ""}};
    } catch (error) {
        return {data: null, error:{has_error: true, error_message: `${error}. Serious issue. Look into this asap`}};
    }

}

export async function get_all_mdx(): Promise<api_return_schema<mdx[]>> {

    const connection = await dbConnect(process.env.DB_IMAGES_NAME)

    try {
        const image_search_result: mdx[] = await mdx_schema(connection).find();
        return {data: image_search_result, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}