const Course = require('../models/courseModel');
const Instructor = require('../models/instructorModel');
const mongoose = require('mongoose');
const courseController = {};

courseController.getAllCourses = async(req, res) => {
    Course.find({}, (err, courses) => {
        if(courses){
            res.json(courses);
        }
        if(err){
            res.json(err);
        }
    })
}

courseController.getCourseById = async(req,res) => {
    Course.findOne({_id: {$in: mongoose.Types.ObjectId(req.params.id)}}, (err, course) => {
        if(course){
            res.json(course);
        }
        if(err){
            res.json(err);
        }
    })
}

courseController.getCourseByTitle = async(req, res) => {

    const { title } = req.body;

    Course.findOne({title}, (err, course) => {
        if(course){
            res.json(course);
        }
        if(err){
            res.json(err);
        }
    })
}

courseController.getCoursesByInstructorId = async(req, res) => {

    Instructor.findOne({_id: {$in : mongoose.Types.ObjectId(req.params.id)}}, (err, instructor) => {
        if(instructor){
            var courses = instructor.givenCourseList;
            if(courses.length === 0){
                res.json({msg: "No courses found :("});
            }else{
                res.json(courses);
            }
        }

        if(err){
            res.json(err);
        }
    })
}

courseController.addCoupon = async(req, res) => {

    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    const id = genRanHex(16);

    const { name, discount_percent } = req.body;

    const obj = {
        id,
        name,
        discount_percent
    }

    Course.findOne({_id: {$in: mongoose.Types.ObjectId(req.params.id)}}, (err, course) => {
        if(course){
            var arr = course.coupons;
            arr.push(obj);
            course.coupons = arr;
            course.couponValue = discount_percent;
            course.save();
            res.json(course);
        }
        if(err){
            res.json(err);
        }
    })
}

courseController.updateCoupon = async(req, res) => {

    const { id, name, discount_percent } = req.body;

    Course.findOne({_id: {$in: mongoose.Types.ObjectId(req.params.id)}}, (err, course) => {
        if(course){
            var coupons = course.coupons;
            var isUpdated = false;
            coupons.map(coupon => {
                if(coupon.id === id){
                    coupon.name = name;
                    coupon.discount_percent = discount_percent;
                    isUpdated = !isUpdated;
                    course.coupons = coupons;
                }
            })
            if(isUpdated){
                res.json(course)
            }else{
                res.json({msg: "No coupon found :("})
            }
        }
        if(err){
            res.json(err);
        }
    })
}

courseController.getCoupon = async(req, res) => {
    Course.findOne({_id: {$in: mongoose.Types.ObjectId(req.params.id)}}, (err, course) => {
        if(course){
            res.json(course.coupons);
        }
        if(err){
            res.json(err);
        }
    })
}

courseController.deleteCoupon = async(req, res) => {
    const { id } = req.body;

    Course.findOne({_id: {$in: mongoose.Types.ObjectId(req.params.id)}}, (err, course) => {
        if(course){
            var coupons = course.coupons;
            var isUpdated = false;
            coupons.map(coupon => {
                if(coupon.id === id){
                    coupons.pop(coupon);
                    course.couponValue = 0;
                    isUpdated = !isUpdated;
                    course.coupons = coupons;
                    course.save();
                }
                
            })
            
            if(isUpdated){
                res.json(course)
            }else{
                res.json({msg: "No coupon found :("})
            }
        }
        if(err){
            res.json(err);
        }
    })
}


module.exports = courseController;