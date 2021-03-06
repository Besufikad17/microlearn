const mongoose = require('mongoose');

const videoItemSchema = new mongoose.Schema({
    vid_title: {
        type: String,
        required: true
    },
    chapter: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("videoitems", videoItemSchema);