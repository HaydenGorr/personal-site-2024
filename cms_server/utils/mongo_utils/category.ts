import { category, api_return_schema } from "../../interfaces/interfaces";
import category_schema from "../../mongo_schemas/category_schema";
import dbConnect from '../db_conn';

export async function get_all_categories(): Promise<api_return_schema<category[]>> {

    const connection = await dbConnect(process.env.DB_CATEGORIES_NAME)

    try {
        const category_search_result: category[] = await category_schema(connection).find().sort({ submit_date: -1 });
        return {data: category_search_result, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}


export async function AddCategory(category_name: string): Promise<api_return_schema<Boolean>>{

    const connection = await dbConnect(process.env.DB_CATEGORIES_NAME)
  
    try {
        const CategoryModel = category_schema(connection);

        const existingCategory = await CategoryModel.findOne({ name: category_name });
        if (existingCategory) {
            return { data: false, error: { has_error: true, error_message: "Category already exists" } };
        }

        const newCat = new CategoryModel({
            name: category_name,
            submit_date: new Date()
        });

        const saved = await newCat.save();

        return {data: true, error:{has_error: false, error_message: ""}};
    } catch (error) {
        return {data: false, error:{has_error: true, error_message: `${error}`}};
    }

}

export async function DeleteCategory(inCategory: category) : Promise<api_return_schema<Boolean>> {
    try {
        console.log("deleting category")
        const connection = await dbConnect(process.env.DB_CATEGORIES_NAME)
        const Category = await category_schema(connection);
        const result = await Category.findByIdAndDelete(inCategory._id);
        
        if (!result) {
            return { 
                data: false,
                error:{
                    has_error: true,
                    error_message: `Could not find the Category in the backend with id ${inCategory._id}`
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