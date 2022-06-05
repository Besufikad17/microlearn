const mongoose = require('mongoose');

const achivementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    givenDate: {
        type: Date,
        default: Date.now
    },
    iconUrl: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("achivement", achivementSchema);