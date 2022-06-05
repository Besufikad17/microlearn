const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    wishList : {
        type: Array,
        default : []
    },
    enrolledCourse: {
        type: Array,
        default: []
    },
    joinedDate : {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    },
    achivements : {
        type: Array,
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role : {
        type: String,
        default: "user"
    },
    paymentData: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model("User", userSchema);