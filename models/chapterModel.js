const mongoose = require('mongoose');

const chapterSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    estimatedHours: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        default: [],
        required: true
    }
});

module.exports = mongoose.model("chapter", chapterSchema);