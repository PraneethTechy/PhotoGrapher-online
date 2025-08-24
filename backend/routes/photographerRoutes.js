
const express = require('express');
const router = express.Router();
const photographerController = require('../controllers/photographerController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multer');

// Set unavailable dates manually (photographer)
router.put('/unavailable-dates', authMiddleware, photographerController.setUnavailableDates);
// Search photographers by category, city, date
router.get('/search', photographerController.searchPhotographers);
// Photographer registration
router.post('/register', photographerController.register);
// Photographer login
router.post('/login', photographerController.login);
// Get own profile
router.get('/profile', authMiddleware, photographerController.getProfile);
// Get photographer profile by ID (public)
router.get('/profile/:id', photographerController.getProfile);
// Update own profile
router.put('/profile', authMiddleware, photographerController.updateProfile);
// Portfolio upload (Cloudinary)
router.post('/portfolio/upload', authMiddleware, upload.single('file'), photographerController.uploadPortfolioItem);

// Photographer profile picture upload
router.post('/profile-picture', authMiddleware, upload.single('profilePicture'), async (req, res) => {
	try {
		const userId = req.user.userId;
		const fileUrl = req.file.path;
		// Update User profilePicture
		const user = await require('../models/User').findById(userId);
		if (user) {
			user.profilePicture = fileUrl;
			await user.save();
		}
		// Update Photographer profilePicture reference if needed
		const Photographer = require('../models/Photographer');
		const photographer = await Photographer.findOne({ user: userId });
		if (photographer) {
			// Optionally store in photographer.profilePicture if you want
			// photographer.profilePicture = fileUrl;
			// await photographer.save();
		}
		res.json({ message: 'Profile picture updated', profilePicture: fileUrl });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
});
// Get all bookings for this photographer
router.get('/bookings', authMiddleware, photographerController.getBookings);
//update booking status
router.put('/bookings/:bookingId/status', authMiddleware, photographerController.updateBookingStatus);

module.exports = router;

