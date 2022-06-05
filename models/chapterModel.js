const mongoose = require('mongoose');

const chapterSchema  = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        default: [],
        required: true
    }
});

module.exports = mongoose.Model("chapter", chapterSchema);