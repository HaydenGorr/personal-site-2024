const mongoose = require('mongoose');

// Define the schema
const chip_schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
  });

const Chip = mongoose.model('chips', chip_schema);

module.exports = {
  Chip,
};
