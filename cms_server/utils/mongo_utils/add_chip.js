const Chip = require('../../mongo_schemas/chip_schema.js');
const { dbConnect } = require('../db_conn')


async function add_chip(inName, inDefinition){

    console.log("creating chip")
  
    await dbConnect(process.env.MONOGDB_CHIPS)
    .then((conn) => {
        
        // Create a new document
        const newChip = new Chip(conn)({
            name: inName,
            description: inDefinition
        });
        
        // Save the document
        return newChip.save();
    })
    .then(() => {
        console.log('Document inserted successfully');
    })
    .catch((err) => {
        console.error('Error:', err);
    });
}


module.exports = {
    add_chip
};
