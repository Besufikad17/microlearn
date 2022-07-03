const userControllers = require('../controllers/userController');
const instructorControllers = require('../controllers/instructorController');
const courseControllers = require('../controllers/courseController');
const utilControllers = require('../controllers/utilController');
const videoItemControllers = require('../controllers/videoItemController');
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

router.get('/api/enrolled_courses/:id', userControllers.getEnrolledCourses);

router.put('/update_user/:id', userControllers.updateUser);

router.delete('/remove/:id', userControllers.deleteUser);

router.post('/add_wishlist/:id', userControllers.addWishlist);

router.get('/wishlist/:id', userControllers.getWishlist);

router.post('/add_course/:id', userControllers.addCourse);

router.put('/drop_course/:id', userControllers.dropCourse);


// instructor endpoints

router.post('/instructor_signup', instructorControllers.add);

router.post('/instructor_login', instructorControllers.login);

router.post('/courses_instructor/', instructorControllers.addCourse);

router.post('/add_chapter', instructorControllers.addChapter);

router.post('/add_item', instructorControllers.addItem);

router.get('/instructors', instructorControllers.getAllinstructors);

router.get('/instructor/:id', instructorControllers.getinstructorById);

router.get('/instructor', instructorControllers.getinstructorByName);


// //router.post('/instructor', auth_middleware.auth, auth.getCurrentUser);

router.put('/update_instructor/:id', instructorControllers.updateinstructor);

router.put('/instructor/update_course/:id', instructorControllers.updateCourse);

router.delete('/remove_instructor/:id', instructorControllers.deleteinstructor);


// courses endpoint

router.get('/courses', courseControllers.getAllCourses);

router.get('/course/:id', courseControllers.getCourseById);

router.get('/course', courseControllers.getCourseByTitle);

router.get('/get_course/:id', courseControllers.getCoursesByInstructorId);

router.post('/add_coupon/:id', courseControllers.addCoupon);

router.get('/coupon/:id', courseControllers.getCoupon);

router.put('/update_coupon/:id', courseControllers.updateCoupon);

router.delete('/delete_coupon/:id', courseControllers.deleteCoupon);

// videoItem endpoints

router.get('/videoItems', videoItemControllers.getAllVideoItems);

router.get('/videoItem/:id', videoItemControllers.getVideoItemById);

// utility routes

router.get('/cards', utilControllers.getCards);

router.post('/recharge/:id', utilControllers.recharge);

router.post('/enroll/:id', utilControllers.enroll);

module.exports = router;