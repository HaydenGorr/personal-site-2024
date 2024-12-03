import mongoose from "mongoose";

// Define the schema
const mdxSchema = new mongoose.Schema({
    file_name: { type: String, required: true, unique: true },
    full_url: { type: String, required: true, unique: true },
    upload_date: { type: Date, required: true, default: Date.now },
});

export default (conn: mongoose.Connection) => conn.model('mdx', mdxSchema);
