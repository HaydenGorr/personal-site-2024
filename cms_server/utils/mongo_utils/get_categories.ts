const category = require('../../mongo_schemas/category_schema.js');
const { dbConnect } = require('../db_conn.js')
import { api_return_schema, category } from "../../interfaces/interfaces"
import { mongo_error_enum } from '../../../error_types/mongo_errors'

async function get_all_categories(): Promise<api_return_schema<category[]>> {

    const connection = await dbConnect(process.env.DB_CATEGORIES_NAME)

    try {
      const category_search_result: category[] = await category(connection).find();
      return {data: category_search_result, error: { has_error: false, error_message:""}}
    } catch (error) {
        console.error('Error:', error);
        return {data: [], error: { has_error: true, error_message:'Internal server error'}}
    }
}

module.exports = {
    get_all_categories,
};
