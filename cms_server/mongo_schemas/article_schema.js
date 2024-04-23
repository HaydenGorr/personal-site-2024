const mongoose = require('mongoose');

// Define the schema
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    infoText: { type: String, required: true },
    chips: { type: [String], default: [] },
    source: { type: String, required: true },
    views: { type: Number, default: 0 },
    publishDate: { type: Date, default: Date.now },
    ready: {type: Boolean, default: false},
});

module.exports = (conn) => conn.model('articles', articleSchema);