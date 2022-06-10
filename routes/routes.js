const userControllers = require('../controllers/userController');
const instructorControllers = require('../controllers/instructorController');
const express = require('express');
const router = express.Router();
const auth_middleware = require('../middleware/auth');
const auth = require('./auth');

// user endpoints

router.post('/user_signup', userControllers.add);

router.post('/user_login', userControllers.login);

router.get('/users', userControllers.getAllUsers);

router.post('/user', auth_middleware.auth, auth.getCurrentUser);

router.get('/user/:id', userControllers.getUserById);

router.get('/get_user', userControllers.getUserByName);

router.put('/update_user/:id', userControllers.updateUser);

router.delete('/remove/:id', userControllers.deleteUser);

router.post('/add_wishlist/:id', userControllers.addWishlist);

router.get('/wishlist/:id', userControllers.getWishlist);

router.post('/courses/:id', userControllers.addCourse);

router.put('/drop_course/:id', userControllers.dropCourse);


// instructor endpoints

router.post('/instructor_signup', instructorControllers.add);

router.post('/instructor_login', instructorControllers.login);

router.post('/courses_instructor/:id', instructorControllers.addCourse);

router.get('/instructors', instructorControllers.getAllinstructors);

router.get('/instructor/:id', instructorControllers.getinstructorById);

router.get('/instructor', instructorControllers.getinstructorByName);

router.get('/instructor/courses/:id', instructorControllers.getUploadedCourses);

router.get('/instructor/course/:id', instructorControllers.getUploadedCourseByTitle);

router.get('/instructor/course_id/:id', instructorControllers.getUploadedCourseById);

// //router.post('/instructor', auth_middleware.auth, auth.getCurrentUser);

router.put('/update_instructor/:id', instructorControllers.updateinstructor);

router.put('/instructor/update_course/:id', instructorControllers.updateCourse);

router.delete('/remove_instructor/:id', instructorControllers.deleteinstructor);


module.exports = router;