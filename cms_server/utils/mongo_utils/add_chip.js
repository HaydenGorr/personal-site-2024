const Chip = require('../../mongo_schemas/chip_schema.js');
const { dbConnect } = require('../db_conn')


async function add_chip(inName, inDefinition){

    console.log("creating chip")

    const connection = await dbConnect(process.env.MONOGDB_CHIPS)
  
    try {
        // Obtain the Chip model for the specific database connection
        const ChipModel = Chip(connection);

        // Now create a new chip instance using the ChipModel
        const newChip = new ChipModel({
            name: inName,
            description: inDefinition
        });

        return await newChip.save();
    } catch (error) {
        console.error('Error:', error);
    }

}


module.exports = {
    add_chip
};
