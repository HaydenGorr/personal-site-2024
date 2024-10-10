const Category = require('../../mongo_schemas/category_schema.js');
const { dbConnect } = require('../db_conn.js')

async function add_category(new_category){

    const connection = await dbConnect(process.env.DB_CATEGORIES_NAME)
  
    try {
        const CategoryModel = Category(connection);

        const newCat = new CategoryModel({
            name: new_category
        });

        const asd = await newCat.save();

        return asd;
    } catch (error) {
        console.error('Error:', error);
    }

}

module.exports = {
    add_category
};
