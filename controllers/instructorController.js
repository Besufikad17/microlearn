const instructor = require('../models/instructorModel');
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

    instructor.findOne({ name }).exec((err, instructor) => {
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
    instructor.findOne({ name })
        .then(instructor => {
            if (instructor) {
                return res.status(400).json({ msg: 'instructor already exists!!' });
            } else {
                const newAcccount = new instructor({
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
    instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, instructor) {
        if (instructor) {
            res.json(instructor)
        }

        if (err) {
            res.json(err)
        }
    })
}

instructorControllers.getAllinstructors = async (req, res) => {
    instructor.find({}, function (err, instructors) {
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

    instructor.find({ name }, function (err, instructor) {
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

    //simpleation
    // if (!name  || !id || !profilePictureUrl || !password) {
    //     console.log('Please enter all fields');
    //     return res.status(400).json({ msg: 'Please enter all fields' });
    // }

    //checking for existing instructor
    instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } })
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
                        enrolledCourse: instructor.enrolledCourse,
                        wishList: instructor.wishList,
                        achievments: instructor.achievments,
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
    instructor.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            console.log(err);
            return res.status(400).json({ msg: "something went wrong!!", details: err })
        } else {
            res.send(data)
        }
    })
}

instructorControllers.addWishlist = async(req, res) => {

    const { wishlist } = req.body;

    instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, instructor) {
        if (instructor) {
            var arr = instructor.wishList;
            arr.push(wishlist);
            instructor.wishList = arr;
            instructor.save();
            res.json(instructor)
        }

        if (err) {
            res.json(err)
        }
    })
}

instructorControllers.getWishlist = async(req, res) => {
    instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, instructor) {
        if (instructor) {
            res.json(instructor.wishList)
        }

        if (err) {
            res.json(err)
        }
    })
}

instructorControllers.addCourse = async(req, res) => {

    instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, instructor) {
        if (instructor) {
            var arr = instructor.enrolledCourse
            arr.push(req.body.course)
            instructor.enrolledCourse = arr;
            instructor.save();
            res.json(instructor)
        }

        if (err) {
            res.json(err)
        }
    })
}

instructorControllers.dropCourse = async(req, res) => {

    const { title } = req.body;

    if(!title){
        return res.status(400).json({ msg: "please enter all fields!!"})
    }

    instructor.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, instructor) {
        if (instructor) {
            var courses = instructor.enrolledCourse;
            var isRemoved = false;
            courses.map(c => {
                if(c.title === title){
                    courses.pop(c);
                    isRemoved = !isRemoved;
                    instructor.enrolledCourse = courses;
                    instructor.save();
                }
            })

            if(isRemoved){
                res.json(instructor)
            }else{
                return res.status(400).json({ msg: "course not in the list!!"})
            }
            
        }

        if (err) {
            res.json(err)
        }
    })

}

module.exports = instructorControllers;