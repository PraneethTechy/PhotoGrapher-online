const express = require('express');
const router = express.Router();

const photographerController = require('../controllers/photographerController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Photographer registration
router.post('/register', photographerController.register);
// Photographer login
router.post('/login', photographerController.login);

// Get own profile
router.get('/profile', authMiddleware, photographerController.getProfile);
// Update own profile
router.put('/profile', authMiddleware, photographerController.updateProfile);

// Portfolio upload (Cloudinary)
const upload = require('../config/multer');
router.post('/portfolio/upload', authMiddleware, upload.single('file'), photographerController.uploadPortfolioItem);

// Get all bookings for this photographer
router.get('/bookings', authMiddleware, photographerController.getBookings);
//update booking status
router.put('/bookings/:bookingId/status', authMiddleware, photographerController.updateBookingStatus);


module.exports = router;

