import mongoose from "mongoose";

// Define the schema
const category_schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true  },
});

export default (conn: mongoose.Connection) => conn.model('categories', category_schema);
