const category = require('../../mongo_schemas/category_schema.js');
const { dbConnect } = require('../db_conn.js')
import { api_return_schema, category } from "../../interfaces/interfaces"

async function get_all_categories(): Promise<api_return_schema<category[]>> {

    const connection = await dbConnect(process.env.DB_CATEGORIES_NAME)

    try {
        const category_search_result: category[] = await category(connection).find();
        return {data: category_search_result, error: { has_error: false, error_message:""}}
    } catch (error) {
        return {data: [], error: { has_error: true, error_message:`${error}`}}
    }
}

module.exports = {
    get_all_categories,
};
