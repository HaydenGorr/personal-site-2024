// delete_article.js
const chip_schema = require('../../mongo_schemas/chip_schema');  // Adjust the path to where your Mongoose model is defined
const { dbConnect }  = require('../db_conn');

async function deleteChip(articleId) {
    try {
        console.log("deleting chip")
        const connection = await dbConnect(process.env.DB_CHIPS_NAME)
        const Chip = await chip_schema(connection);
        const result = await Chip.findByIdAndDelete(articleId);
        
        if (!result) {
            console.log("Chip not found")
            return { success: false, message: "Chip not found" };
        }
        console.log("Chip deleted successfully")
        return { success: true, message: "Chip deleted successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
  }

module.exports = {
    deleteChip
};
