import mongoose from "mongoose";
import { Schema } from "mongoose";

// Define the schema
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {type: String, required: true, default: 'NO_CATEGORY' },
    infoText: { type: String, required: false, default: 'NO_INFO_TEXT' },
    chips: { type: [String], default: [] },
    views: { type: Number, default: 0 },
    publishDate: { type: Date, required: true, default: Date.now },
    ready: {type: Boolean, default: false},
    portfolioReady: {type: Boolean, default: false},
    type: {type: String, default: "misc."},
    image: { type: Schema.Types.ObjectId, ref: 'images', required: true },
    mdx: { type: Schema.Types.ObjectId, ref: 'mdx', required: true },

});

export default (conn: mongoose.Connection) => conn.model('articles', articleSchema);
