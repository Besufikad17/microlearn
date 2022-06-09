const userControllers = require('../controllers/userController');
const instructorControllers = require('../controllers/instructorController');
const express = require('express');
const router = express.Router();
const auth_middleware = require('../middleware/auth');
const auth = require('./auth');

// user endpoints

router.post('/add', userControllers.add);

router.post('/login', userControllers.login);

router.get('/users', userControllers.getAllUsers);

router.post('/user', auth_middleware.auth, auth.getCurrentUser);

router.get('/user/:id', userControllers.getUserById);

router.get('/get_user', userControllers.getUserByName);

router.put('/update/:id', userControllers.updateUser);

router.delete('/remove/:id', userControllers.deleteUser);

router.post('/add_wishlist/:id', userControllers.addWishlist);

router.get('/wishlist/:id', userControllers.getWishlist);

router.post('/courses/:id', userControllers.addCourse);

router.put('/drop_course/:id', userControllers.dropCourse);


// instructor endpoints

router.post('/add', instructorControllers.add);

router.post('/login', instructorControllers.login);

router.get('/instructors', instructorControllers.getAllinstructors);

//router.post('/instructor', auth_middleware.auth, auth.getCurrentUser);

router.get('/instructor/:id', instructorControllers.getinstructorById);

router.get('/get_instructor', instructorControllers.getinstructorByName);

router.put('/update/:id', instructorControllers.updateinstructor);

router.delete('/remove/:id', instructorControllers.deleteinstructor);

module.exports = router;