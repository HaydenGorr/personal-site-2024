import mongoose from 'mongoose';

// Define the schema
const chip_schema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    submit_date: { type: Date, required: true, default: Date.now },
});

export default (conn: mongoose.Connection) => conn.model('chips', chip_schema);
