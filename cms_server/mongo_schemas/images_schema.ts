import mongoose from "mongoose";

// Define the schema
const imageSchema = new mongoose.Schema({
    file_name: { type: String, required: true, unique: true },
    full_url: { type: String, required: true, unique: true },
    upload_date: { type: Date, required: true, default: Date.now },
    category: {type: String, required: true},
});

export default (conn: mongoose.Connection) => conn.model('images', imageSchema);
