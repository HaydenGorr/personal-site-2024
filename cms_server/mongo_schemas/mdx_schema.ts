import mongoose from "mongoose";

// Define the schema
const mdxSchema = new mongoose.Schema({
    file_name: { type: String, required: true, unique: true },
    full_url: { type: String, required: true, unique: true },
});

export default (conn: mongoose.Connection) => conn.model('images', mdxSchema);
