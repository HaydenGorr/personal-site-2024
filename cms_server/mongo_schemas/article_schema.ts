import mongoose from "mongoose";

// Define the schema
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    category: {type: String, required: false},
    infoText: { type: String, required: true },
    chips: { type: [String], default: [] },
    source: { type: String, required: true },
    views: { type: Number, default: 0 },
    publishDate: { type: Date, default: Date.now },
    ready: {type: Boolean, default: false},
    portfolioReady: {type: Boolean, default: false},
    type: {type: String, default: "misc."},
    image: {type: String, default: ""},
    article: { type: String, required: true, default: "" },
});

export default (conn: mongoose.Connection) => conn.model('articles', articleSchema);
