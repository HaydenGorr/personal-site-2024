// delete_article.js
const category_schema = require('../../mongo_schemas/category_schema');  // Adjust the path to where your Mongoose model is defined
const { dbConnect }  = require('../db_conn');
import { api_return_schema, category } from "../../interfaces/interfaces";

async function DeleteCategory(inCategory: category) : Promise<api_return_schema<Boolean>> {
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

module.exports = {
    DeleteCategory
};
