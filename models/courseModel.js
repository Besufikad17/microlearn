const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    estimatedHours : {
        type: String,
        required: true
    },
    backDropPictureUrl : {
        type: String,
        required: true
    },
    coverPictureUrl : {
        type: String,
        required: true
    },
    instructor: {
        type: Object,
        required: true
    },
    uploadedDate: {
        type: Date,
        default: Date.now
    },
    items: {
        type: Array,
        default: []
    },
    coupons: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    couponValue: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    chapters: {
        type: Array,
        default: [],
        required: true
    }
});

module.exports = mongoose.model("course", courseSchema);