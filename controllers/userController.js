const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const userControllers = {};

userControllers.login = async (req, res) => {

    const { name, password } = req.body;

    console.log(name, password);

    if (!name || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ name }).exec((err, user) => {
        if (err) {
            res.status(400).send({ message: err });
            res.status(500).send({ message: err });
            return;
        }
        console.log(user);
        if (user) {
            console.log("trigerred");
            jwt.sign({ user }, 'secretKey', (err, token) => {
                console.log(token)
                let userInfo = {
                    user: user,
                    token: token
                }
                res.json(userInfo)
            })
        }
    })
}

userControllers.add = async (req, res) => {
    const { name, sirname, profilePictureUrl, password } = req.body;

    //simple validation
    if (!name || !sirname || !profilePictureUrl || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    //checking for existing user
    User.findOne({ name })
        .then(user => {
            if (user) {
                return res.status(400).json({ msg: 'User already exists!!' });
            } else {
                const newAcccount = new User({
                    name,
                    sirname,
                    profilePictureUrl,
                    password
                })

                //create salt and hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAcccount.password, salt, (err, hash) => {
                        if (err) throw err;
                        newAcccount.password = hash;
                        newAcccount.save().
                            then(user => {
                                jwt.sign({ id: user.id }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            profilePictureUrl: user.profilePictureUrl
                                        }
                                    })
                                })
                            })
                    })
                })
            }
        })
}

userControllers.getUserById = async (req, res) => {
    User.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, user) {
        if (user) {
            res.json(user)
        }

        if (err) {
            res.json(err)
        }
    })
}

userControllers.getAllUsers = async (req, res) => {
    User.find({}, function (err, users) {
        if (users) {
            res.json(users)
        }
        if (err) {
            res.json(err)
        }
    })
}

userControllers.getUserByName = async (req, res) => {

    const { name } = req.body;

    User.find({ name }, function (err, user) {
        if (user) {
            res.send(user)
        }

        if (err) {
            res.json(err)
        }
    })
}


userControllers.updateUser = async (req, res) => {
    const { name, profilePictureUrl, password } = req.body;

    //simpleation
    // if (!name  || !id || !profilePictureUrl || !password) {
    //     console.log('Please enter all fields');
    //     return res.status(400).json({ msg: 'Please enter all fields' });
    // }

    //checking for existing user
    User.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } })
        .then(user => {
            if (user) {
                user.name = name;
                user.profilePictureUrl = profilePictureUrl;

                //create salt and hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        user.password = hash;
                        user.save();
                    })
                })

                res.json({
                    user: {
                        name: user.name,
                        password: password,
                        profilePictureUrl: user.profilePictureUrl,
                        enrolledCourse: user.enrolledCourse,
                        wishList: user.wishList,
                        achievments: user.achievments,
                        isVerified: user.isVerified,
                        role: user.role
                    }
                })

            } else {
                return res.status(400).json({ msg: 'User doesnt exist!!' });
            }
        }).catch(err => {
            console.log(err);
        })
}

userControllers.deleteUser = async (req, res) => {
    User.findByIdAndDelete(req.params.id, (error, data) => {
        if (error) {
            console.log(err);
            return res.status(400).json({ msg: "something went wrong!!", details: err })
        } else {
            res.send(data)
        }
    })
}

userControllers.addWishlist = async(req, res) => {

    const { wishlist } = req.body;

    User.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, user) {
        if (user) {
            var arr = user.wishList;
            arr.push(wishlist);
            user.wishList = arr;
            user.save();
            res.json(user)
        }

        if (err) {
            res.json(err)
        }
    })
}

userControllers.getWishlist = async(req, res) => {
    User.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, user) {
        if (user) {
            res.json(user.wishList)
        }

        if (err) {
            res.json(err)
        }
    })
}

userControllers.addCourse = async(req, res) => {

    User.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, user) {
        if (user) {
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

userControllers.dropCourse = async(req, res) => {

    const { title } = req.body;

    if(!title){
        return res.status(400).json({ msg: "please enter all fields!!"})
    }

    User.findOne({ _id: { $in: mongoose.Types.ObjectId(req.params.id) } }, function (err, user) {
        if (user) {
            var courses = user.enrolledCourse;
            var isRemoved = false;
            courses.map(c => {
                if(c.title === title){
                    courses.pop(c);
                    isRemoved = !isRemoved;
                    user.enrolledCourse = courses;
                    user.save();
                }
            })

            if(isRemoved){
                res.json(user)
            }else{
                return res.status(400).json({ msg: "course not in the list!!"})
            }
            
        }

        if (err) {
            res.json(err)
        }
    })

}

module.exports = userControllers;