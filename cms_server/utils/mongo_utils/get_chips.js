const { MONOGDB_CHIPS } = require('../path_consts')
const { Chip } = require('../../mongo_schemas/chip_schema');
const mongoose = require('mongoose');

async function get_chips() {

    console.log("connecting to:   ", MONOGDB_CHIPS)
  
    try {
      await mongoose.connect(MONOGDB_CHIPS);
      const chips = await Chip.find();
      return chips
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    } finally {
        await mongoose.connection.close();
    }
}

module.exports = {
    get_chips
};
