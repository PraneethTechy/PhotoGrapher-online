const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// User registration
router.post('/register', userController.register);

// User login
router.post('/login', userController.login);

//search photographers by category or location
router.get('/searchPhotographers', userController.searchPhotographers);

// Book a photographer
router.post('/book', authMiddleware, userController.bookPhotographer);

// Get all bookings for the logged-in user
router.get('/my-bookings', authMiddleware, userController.getMyBookings);


// Upload or update profile picture
const upload = require('../config/multer');
router.post('/profile-picture', authMiddleware, upload.single('profilePicture'), userController.uploadProfilePicture);

// Leave a review (only after completed booking)
router.post('/leave-review', authMiddleware, userController.leaveReview);


module.exports = router;

