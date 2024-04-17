const mongoose = require('mongoose');
const { MONOGDB_CHIPS } = require('../path_consts')
const { Chip } = require('../../mongo_schemas/chip_schema')

async function add_chip(inName, inDefinition){

    console.log("creating chip")
  
    await mongoose.connect(MONOGDB_CHIPS)
    .then(() => {
        
        // Create a new document
        const newChip = new Chip({
            name: inName,
            description: inDefinition
        });
        
        // Save the document
        return newChip.save();
    })
    .then(() => {
        console.log('Document inserted successfully');
        // Close the connection
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
}


module.exports = {
    add_chip
};
