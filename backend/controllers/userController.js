// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Edit user profile
const editProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, email, phone, address, profilePicture } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (profilePicture) user.profilePicture = profilePicture;
        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Booking = require('../models/Booking');
const Photographer = require('../models/Photographer');
const Review = require('../models/Review');

// User Controller
const register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (role defaults to 'user')
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: 'user'
        });

        await user.save();

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.MYSecretKey || 'mysecretkey',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Upload or update profile picture
const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Optionally: Delete old profile picture from Cloudinary here
        user.profilePicture = req.file.path; // Cloudinary URL
        await user.save();
        res.json({ message: 'Profile picture updated', profilePicture: user.profilePicture });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const searchPhotographers = async (req, res) => {
    try {
        // Get query params: category, minRating, location (address)
        const { category, minRating, location } = req.query;

        // Build search filter
        let filter = { isApproved: true };
        if (category) {
            filter.categories = { $in: [category] };
        }
        if (minRating) {
            filter.rating = { $gte: Number(minRating) };
        }

        // Find photographers matching filter
        let photographers = await Photographer.find(filter)
            .populate({
                path: 'user',
                match: location ? { address: { $regex: location, $options: 'i' } } : {},
                select: 'name email phone address'
            })
            .lean();

        // Remove photographers whose user is null (location filter mismatch)
        photographers = photographers.filter(p => p.user);

        res.json({ photographers });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const bookPhotographer = async (req, res) => {
    try {
        const { photographerId, date } = req.body;
        const userId = req.user.userId; // req.user is set by authMiddleware

        // Check if booking already exists for this user, photographer, and date
        const existingBooking = await Booking.findOne({
            user: userId,
            photographer: photographerId,
            date: new Date(date)
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You have already booked this photographer for the selected date.' });
        }

        // Create new booking
        const booking = new Booking({
            user: userId,
            photographer: photographerId,
            date: new Date(date),
            status: 'pending'
        });

        await booking.save();

        res.status(201).json({
            message: 'Booking request sent successfully!',
            booking
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'photographer',
                populate: { path: 'user', select: 'name email phone address' },
                select: 'categories rating'
            })
            .sort({ date: -1 });
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


const leaveReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { photographerId, rating, comment } = req.body;

        // Check if user has a completed booking with this photographer
        const completedBooking = await Booking.findOne({
            user: userId,
            photographer: photographerId,
            status: 'completed'
        });
        if (!completedBooking) {
            return res.status(400).json({ message: 'You can only review after a completed booking.' });
        }

        // Check if user already left a review for this booking
        const existingReview = await Review.findOne({
            user: userId,
            photographer: photographerId
        });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this photographer.' });
        }

        // Create review
        const review = new Review({
            user: userId,
            photographer: photographerId,
            rating,
            comment
        });
        await review.save();

        res.status(201).json({ message: 'Review submitted successfully!', review });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    register,
    login,
    searchPhotographers,
    bookPhotographer,
    getMyBookings,
    leaveReview,
    uploadProfilePicture,
    getProfile,
    editProfile
};