const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sirname : {
        type: String,
        required: true
    },
    profilePictureUrl : {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    joinedDate : {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    paymentData: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model("instructor", instructorSchema);