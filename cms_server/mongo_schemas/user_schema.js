const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = (conn) => conn.model('users', userSchema);