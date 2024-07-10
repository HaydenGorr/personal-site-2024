const Chip = require('../../mongo_schemas/chip_schema.js');
const { dbConnect } = require('../db_conn')
async function get_chips() {

    const connection = await dbConnect(process.env.DB_CHIPS_NAME)
  
    try {
      const chips = await Chip(connection).find();
      return chips
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    }
}

async function get_chip(inName) {

    console.log("getting chip with name", inName)

    const connection = await dbConnect(process.env.DB_CHIPS_NAME)
  
    try {
        const chips = await Chip(connection).find({name: inName});
        console.log("found chips", inName)
        return chips
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    }
}

module.exports = {
    get_chips,
    get_chip
};
