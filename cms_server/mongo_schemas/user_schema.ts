import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

export default (conn: mongoose.Connection) => conn.model('users', userSchema);
