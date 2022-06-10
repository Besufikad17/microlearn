const VideoItem = require('../models/videoItemModel');
const mongoose = require('mongoose');
const videoItemControllers = {};

videoItemControllers.getAllVideoItems = async(req,res) => {

    VideoItem.find({}, (err, videoItems) => {
        if(videoItems){
            res.json(videoItems);
        }
        if(err){
            res.json(err);
        }
    })
}

videoItemControllers.getVideoItemById = async(req,res) => {

    VideoItem.find({_id:{$in: mongoose.Types.ObjectId(req.params.id)}}, (err, videoItems) => {
        if(videoItems){
            res.json(videoItems);
        }
        if(err){
            res.json(err);
        }
    })
}

module.exports = videoItemControllers;