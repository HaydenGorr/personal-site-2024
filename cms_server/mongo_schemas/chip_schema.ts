import mongoose from 'mongoose';

// Define the schema
const chip_schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});

export default (conn: mongoose.Connection) => conn.model('chips', chip_schema);
