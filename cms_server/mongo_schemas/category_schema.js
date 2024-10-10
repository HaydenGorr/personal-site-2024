const mongoose = require('mongoose');

// Define the schema
const category_schema = new mongoose.Schema({
    name: { type: String, required: true },
});

module.exports = (conn) => conn.model('categories', category_schema);
