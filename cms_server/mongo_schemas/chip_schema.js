const mongoose = require('mongoose');

// Define the schema
const chip_schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});

module.exports = (conn) => conn.model('chips', chip_schema);
