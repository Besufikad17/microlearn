const utilControllers = {};
const User = require('../models/userModel');
const Instructor = require('../models/instructorModel');
const mongoose = require('mongoose');

const card_types = [50, 100, 200, 500, 1000];

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const generateCards = () => {
    var arr = [];
    for (var i = 0; i < 10; i++) {
        arr.push(genRanHex(10));
    }
    return arr;
}

card_obj = {};

for (var j = 0; j < card_types.length; j++) {
    card_obj[card_types[j]] = generateCards();
}

utilControllers.getCards = async(req, res) => {
     res.json({
        card_obj
    })
}

utilControllers.recharge = async(req, res) => {

    const { card } = req.body;
    var isFound = false;
    var cost = 0;

    for(const c in card_obj){
        card_obj[c].map(cr => {
            console.log(cr);
            if(cr === card){
                isFound = !isFound;
                cost = c;
            }
        })
    }

    if(isFound){
        User.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, user) {
            if(user){
                var amount =  user.paymentData.amount ? parseInt(user.paymentData.amount) + parseInt(cost) : parseInt(cost);
                var pdata = { amount }
                user.paymentData = pdata;
                user.save();
                res.json(user);
            }
            if(err){
                res.json(err)
            }
        })
    }else{
        res.json({msg : "Invalid card!!"})
    }
}

utilControllers.enroll = async(req, res) => {

    User.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, user) {
        if (user) {
            var instructor = req.body.course.instructor;
            var cost =  req.body.course.price;
            user.paymentData.amount = parseInt(user.paymentData.amount) - parseInt(cost);

            Instructor.findOne({ name : instructor}, function (err, instructor) {

                if(instructor){
                    var amount =  instructor.paymentData.amount ? parseInt(instructor.paymentData.amount) + parseInt(cost) : parseInt(cost);
                    var pdata = { amount }
                    instructor.paymentData = pdata;
                    instructor.save();
                }

                if(err){
                    res.json(err);
                }

            })
            var arr = user.enrolledCourse
            arr.push(req.body.course)
            user.enrolledCourse = arr;
            user.save();
            res.json(user)
        }

        if (err) {
            res.json(err)
        }
    })

}

module.exports = utilControllers;