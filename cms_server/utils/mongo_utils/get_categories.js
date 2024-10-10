const category = require('../../mongo_schemas/category_schema.js');
const { dbConnect } = require('../db_conn.js')

async function get_all_categories() {

    const connection = await dbConnect(process.env.DB_CATEGORIES_NAME)

    try {
      const category_search_result = await category(connection).find();
      return category_search_result
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    }
}

module.exports = {
    get_all_categories,
};
