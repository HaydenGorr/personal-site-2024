import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the schema
const mdxSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    file_name: { type: String, required: true, unique: true },
    full_url: { type: String, required: true, unique: true },
    upload_date: { type: Date, required: true, default: Date.now },
    edit_date: { type: Date, required: true, default: Date.now },
    images: [{ type: Schema.Types.ObjectId, ref: 'images', required: true, default: [] }],
    snippet : { type: String, required: true, default: "" }
});

export default (conn: mongoose.Connection) => conn.model('mdx', mdxSchema);
