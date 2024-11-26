import { api_return_schema } from "../../interfaces/interfaces";
const Category = require('../../mongo_schemas/category_schema.js');
const { dbConnect } = require('../db_conn.js')

async function add_category(category_name: string): Promise<api_return_schema<Boolean>>{

    const connection = await dbConnect(process.env.DB_CATEGORIES_NAME)
  
    try {
        const CategoryModel = Category(connection);

        const existingCategory = await CategoryModel.findOne({ name: category_name });
        if (existingCategory) {
            return { data: false, error: { has_error: true, error_message: "Category already exists" } };
        }

        const newCat = new CategoryModel({
            name: category_name
        });

        const saved = await newCat.save();

        return {data: true, error:{has_error: false, error_message: ""}};
    } catch (error) {
        return {data: false, error:{has_error: true, error_message: `${error}`}};
    }

}

module.exports = {
    add_category
};
