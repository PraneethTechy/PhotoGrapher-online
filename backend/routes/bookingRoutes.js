const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const photographerController = require('../controllers/photographerController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new booking (user books a photographer)
router.post('/', authMiddleware, bookingController.createBooking);

// Get all bookings for the logged-in user
router.get('/user', authMiddleware, bookingController.getBookingsByUser);

// Get all bookings for the logged-in photographer
router.get('/photographer', authMiddleware, bookingController.getBookingsByPhotographer);

router.put('/:bookingId/status', authMiddleware, bookingController.updateBookingStatus);

// Update booking status (approve/reject/complete) by photographer
router.put('/:bookingId/status', authMiddleware, photographerController.updateBookingStatus);

module.exports = router;
