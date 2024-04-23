const Chip = require('../../mongo_schemas/chip_schema.js');
const { dbConnect } = require('../db_conn')
const { MONOGDB_CHIPS } = require('../path_consts.js')


async function add_chip(inName, inDefinition){

    console.log("creating chip")

    const connection = await dbConnect(process.env.DB_CHIPS_NAME)
  
    try {
        // Obtain the Chip model for the specific database connection
        const ChipModel = Chip(connection);

        // Now create a new chip instance using the ChipModel
        const newChip = new ChipModel({
            name: inName,
            description: inDefinition
        });

        const asd = await newChip.save();

        console.log("SENATORS ", asd)

        return asd;
    } catch (error) {
        console.error('Error:', error);
    }

}


module.exports = {
    add_chip
};
