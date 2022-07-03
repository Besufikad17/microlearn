const Instructor = require('../models/instructorModel');
const Course = require('../models/courseModel');
const Chapter = require('../models/chapterModel');
const VideoItem = require('../models/videoItemModel');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const instructorControllers = {};

instructorControllers.login = async (req, res) => {

    const { name, password } = req.body;

    console.log(name, password);

    if (!name || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    Instructor.findOne({ name }).exec((err, instructor) => {
        if (err) {
            res.status(400).send({ message: err });
            res.status(500).send({ message: err });
            return;
        }
        console.log(instructor);
        if (instructor) {
            console.log("trigerred");
            jwt.sign({ instructor }, 'secretKey', (err, token) => {
                console.log(token)
                let instructorInfo = {
                    instructor: instructor,
                    token: token
                }
                res.json(instructorInfo)
            })
        }
    })
}

instructorControllers.add = async (req, res) => {
    const { name, sirname, profilePictureUrl, password, title } = req.body;

    //simple validation
    if (!name || !sirname || !profilePictureUrl || !password || !title) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    //checking for existing instructor
    Instructor.findOne({ name })
        .then(instructor => {
            if (instructor) {
                return res.status(400).json({ msg: 'instructor already exists!!' });
            } else {
                const newAcccount = new Instructor({
                    name,
                    sirname,
                    profilePictureUrl,
                    password,
                    title
                })

                //create salt and hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAcccount.password, salt, (err, hash) => {
                        if (err) throw err;
                        newAcccount.password = hash;
                        newAcccount.save().
                            then(instructor => {
                                jwt.sign({ id: instructor.id }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        instructor: {
                                            id: instructor.id,
                                            name: instructor.name,
                                            profilePictureUrl: instructor.profilePictureUrl
                                        }
                                    })
                                })
                            })
                    })
                })
            }
        })
}

instructorControllers.getinstructorById = async (req, res) => {
    Instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, instructor) {
        if (instructor) {
            res.json(instructor)
        }

        if (err) {
            res.json(err)
        }
    })
}

instructorControllers.getAllinstructors = async (req, res) => {
    Instructor.find({}, function (err, instructors) {
        if (instructors) {
            res.json(instructors)
        }
        if (err) {
            res.json(err)
        }
    })
}

instructorControllers.getinstructorByName = async (req, res) => {

    const { name } = req.body;

    Instructor.find({ name }, function (err, instructor) {
        if (instructor) {
            res.send(instructor)
        }

        if (err) {
            res.json(err)
        }
    })
}


instructorControllers.updateinstructor = async (req, res) => {
    const { name, profilePictureUrl, password } = req.body;

    //checking for existing instructor
    Instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } })
        .then(instructor => {
            if (instructor) {
                instructor.name = name;
                instructor.profilePictureUrl = profilePictureUrl;

                //create salt and hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        instructor.password = hash;
                        instructor.save();
                    })
                })

                res.json({
                    instructor: {
                        name: instructor.name,
                        password: password,
                        profilePictureUrl: instructor.profilePictureUrl,
                        title: instructor.title,
                        isVerified: instructor.isVerified,
                        role: instructor.role
                    }
                })

            } else {
                return res.status(400).json({ msg: 'instructor doesnt exist!!' });
            }
        }).catch(err => {
            console.log(err);
        })
}

instructorControllers.deleteinstructor = async (req, res) => {
    Instructor.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            console.log(err);
            return res.status(400).json({ msg: "something went wrong!!", details: err })
        } else {
            res.send(data)
        }
    })
}


instructorControllers.addCourse = async(req, res) => {

    Instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, instructor) {
        if (instructor) {
            const newCourse = new Course(req.body);
            newCourse.save();
            res.json(newCourse);
        }

        if (err) {
            res.json(err)
        }
    })
}

instructorControllers.addChapter = async(req, res) => {

   const newChapter = new Chapter(req.body);
   newChapter.save();
   res.json(newChapter);

}

instructorControllers.addItem = async(req, res) => {

    const newItem = new VideoItem(req.body);
    newItem.save();
    res.json(newItem);
}


instructorControllers.updateCourse = async(req, res) => {

    const { id, title, estimatedHours, backDropPictureUrl, coverPictureUrl, chapters, price } = req.body;

    Instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, instructor) {
        if (instructor) {
            Course.findOne({_id: {$in: mongoose.Types.ObjectId(id)}}, function(err, course){
                if(course){
                    course.title = title;
                    course.estimatedHours = estimatedHours;
                    course.backDropPictureUrl = backDropPictureUrl;
                    course.coverPictureUrl = coverPictureUrl;
                    course.chapters = chapters;
                    course.price = price;
                    course.save();
                }
            })
            res.json(instructor)
        }

        if (err) {
            res.json(err)
        }
    })

}

module.exports = instructorControllers;