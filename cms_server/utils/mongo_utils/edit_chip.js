const Chip = require('../../mongo_schemas/chip_schema.js');
const { dbConnect } = require('../db_conn')
const { MONOGDB_CHIPS } = require('../path_consts.js')


async function edit_chip(id, inName, inDefinition){
  
    console.log("editing chip")  

    try {

        const connection = await dbConnect(process.env.DB_CHIPS_NAME)

        // Obtain the Chip model for the specific database connection
        const ChipModel = Chip(connection);

        // Update the chip
        const updatedChip = await ChipModel.findOneAndUpdate(
            { _id: id }, 
            { name: inName, definition: inDefinition},
            { new: true }  // Return the updated document
        );

        // Check if the chip was found and updated
        if (updatedChip) {
            console.log('Chip edited!');
            return true;
        } else {
            console.log('Chip not found');
            return false;
        }
        
    } catch (error) {
        console.error('Error:', error);
    }

}


module.exports = {
    edit_chip
};
