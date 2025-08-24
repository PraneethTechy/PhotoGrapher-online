// Photographer sets unavailable dates manually
const setUnavailableDates = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { dates } = req.body; // array of ISO date strings
        const photographer = await Photographer.findOne({ user: userId });
        if (!photographer) {
            return res.status(404).json({ message: 'Photographer profile not found.' });
        }
        photographer.unavailableDates = dates.map(d => new Date(d));
        await photographer.save();
        res.json({ message: 'Unavailable dates updated.', unavailableDates: photographer.unavailableDates });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// Search photographers by category, city, date
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const searchPhotographers = async (req, res) => {
    try {
        const { category, city, date } = req.query;
        // Build query for Photographer
        let photographerQuery = { isApproved: true };
        if (category) {
            // Case-insensitive category search
            photographerQuery.categories = { $regex: category, $options: 'i' };
        }
        if (city) {
            // Search by city OR state, case-insensitive
            photographerQuery.$or = [
                { city: { $regex: city, $options: 'i' } },
                { state: { $regex: city, $options: 'i' } }
            ];
        }
        // Optionally add state filter here if needed
        // Find photographers and populate user
        let photographers = await Photographer.find(photographerQuery).populate('user');

        // If no filter is provided, show all photographers
        if (!category && !city && !date) {
            photographers = photographers.filter(p => p.user); // Only show those with user profile
        } else {
            // If date is provided, filter by unavailableDates and bookings
            if (date) {
                const dateObj = new Date(date);
                // Remove time for comparison
                const dateStr = dateObj.toDateString();
                // Find photographers booked on this date
                const unavailable = await Booking.find({ date: dateObj }).distinct('photographer');
                photographers = photographers.filter(p => {
                    // Not booked and not in unavailableDates
                    const isBooked = unavailable.includes(p._id.toString());
                    const isUnavailable = p.unavailableDates && p.unavailableDates.some(d => new Date(d).toDateString() === dateStr);
                    return !isBooked && !isUnavailable;
                });
            }
        }

        // Attach average rating
        photographers = await Promise.all(photographers.map(async p => {
            const reviews = await Review.find({ photographer: p._id });
            p = p.toObject();
            p.averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : null;
            // Attach profilePicture from User
            p.profilePicture = p.user && p.user.profilePicture ? p.user.profilePicture : null;
            return p;
        }));
        res.json({ photographers });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// Photographer Controller
const User = require('../models/User');
const Photographer = require('../models/Photographer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Portfolio upload handler
const uploadPortfolioItem = async (req, res) => {
    console.log('Portfolio upload route hit');
    try {
        if (!req.file) {
            console.log('No file received');
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        // file is uploaded to Cloudinary by multer-storage-cloudinary
    const fileUrl = req.file.path;
    const userId = req.user.userId;
        console.log('File uploaded:', fileUrl, 'User:', userId);
        // Find photographer by user
        const photographer = await Photographer.findOne({ user: userId });
        if (!photographer) {
            console.log('Photographer profile not found for user:', userId);
            return res.status(404).json({ message: 'Photographer profile not found.' });
        }
        // Add file URL to portfolio array
        photographer.portfolio.push(fileUrl);
        await photographer.save();
        res.status(200).json({ message: 'Portfolio item uploaded successfully.', url: fileUrl });
    } catch (err) {
        console.error('Upload failed:', err);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
};

// Photographer registration (pending admin approval)
const register = async (req, res) => {
    try {
    const { name, email, password, phone, address, city, state, categories } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with role photographer and isApproved false
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: 'photographer',
            isApproved: false
        });
        await user.save();

        // Create photographer profile
        const photographer = new Photographer({
            user: user._id,
            categories,
            city,
            state,
            isApproved: false
        });
        await photographer.save();

        res.status(201).json({
            message: 'Photographer registration submitted. Pending admin approval.',
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

// Photographer login (only if approved)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'photographer' });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        if (!user.isApproved) {
            return res.status(403).json({ message: 'Photographer account not approved by admin yet.' });
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


// Get photographer profile by photographer ID or user ID
const getProfile = async (req, res) => {
    try {
        // You can get photographer by req.params.id (photographerId) or req.user.userId (if using auth)
        const { id } = req.params;
        let photographer;
        if (id) {
            photographer = await Photographer.findById(id).populate({
                path: 'user',
                select: 'name email phone address'
            });
        } else if (req.user && req.user.userId) {
            photographer = await Photographer.findOne({ user: req.user.userId }).populate({
                path: 'user',
                select: 'name email phone address'
            });
        } else {
            return res.status(400).json({ message: 'Photographer ID or user authentication required.' });
        }
        if (!photographer) {
            return res.status(404).json({ message: 'Photographer not found.' });
        }
        res.json({ photographer });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
const updateProfile = async (req, res) => {
    try {
        // Only allow authenticated photographer to update their own profile
        const userId = req.user.userId;
    const { name, email, phone, address, city, state, categories } = req.body;

        // Update User info
        const user = await User.findOneAndUpdate(
            { _id: userId, role: 'photographer' },
            { $set: { name, email, phone, address } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'Photographer user not found.' });
        }

        // Update Photographer profile
        const photographer = await Photographer.findOneAndUpdate(
            { user: userId },
            { $set: { categories, city, state } },
            { new: true }
        ).populate({ path: 'user', select: 'name email phone address' });
        if (!photographer) {
            return res.status(404).json({ message: 'Photographer profile not found.' });
        }

        res.json({ message: 'Profile updated successfully', photographer });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
// Add a portfolio item (upload file and add URL to portfolio)
const addPortfolioItem = async (req, res) => {
    try {
        const fileUrl = req.file.path;
        const userId = req.user.id;
        const photographer = await Photographer.findOne({ user: userId });
        if (!photographer) {
            return res.status(404).json({ message: 'Photographer profile not found.' });
        }
        photographer.portfolio.push(fileUrl);
        await photographer.save();
        res.status(200).json({ message: 'Portfolio item added successfully.', url: fileUrl });
    } catch (err) {
        res.status(500).json({ message: 'Add portfolio item failed', error: err.message });
    }
};

// Delete a portfolio item (remove URL from portfolio and delete from Cloudinary)
const { cloudinary } = require('../config/cloudinary');
const deletePortfolioItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { url } = req.body; // URL to delete
        const photographer = await Photographer.findOne({ user: userId });
        if (!photographer) {
            return res.status(404).json({ message: 'Photographer profile not found.' });
        }
        const index = photographer.portfolio.indexOf(url);
        if (index === -1) {
            return res.status(404).json({ message: 'Portfolio item not found.' });
        }
        // Remove from portfolio array
        photographer.portfolio.splice(index, 1);
        await photographer.save();
        // Extract public_id from Cloudinary URL
        const regex = /photographer_portfolio\/(.*)(\.[a-zA-Z0-9]+)?$/;
        const match = url.match(regex);
        if (match && match[1]) {
            const publicId = `photographer_portfolio/${userId}/${match[1]}`.replace(/\.[a-zA-Z0-9]+$/, '');
            await cloudinary.uploader.destroy(publicId);
        }
        res.status(200).json({ message: 'Portfolio item deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Delete portfolio item failed', error: err.message });
    }
};

const getBookings = async (req, res) => {
    try {
        // Find the photographer profile for the logged-in user
        const photographerProfile = await Photographer.findOne({ user: req.user.userId });
        if (!photographerProfile) {
            return res.status(404).json({ message: 'Photographer profile not found.' });
        }

        // Find all bookings for this photographer
        const bookings = await Booking.find({ photographer: photographerProfile._id })
            .populate('user', 'name email phone')
            .sort({ date: -1 });

        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body; // e.g., 'accepted', 'completed', 'cancelled'

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        // Only allow photographer to update their own booking
        const photographerProfile = await Photographer.findOne({ user: req.user.userId });
        if (!photographerProfile || String(booking.photographer) !== String(photographerProfile._id)) {
            return res.status(403).json({ message: 'Not authorized to update this booking.' });
        }

        // Allowed status changes
        const allowedStatuses = ['accepted', 'completed', 'cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        booking.status = status;
        await booking.save();

        // If accepted, add date to unavailableDates
        if (status === 'accepted') {
            if (!photographerProfile.unavailableDates.some(d => d.getTime() === booking.date.getTime())) {
                photographerProfile.unavailableDates.push(booking.date);
                await photographerProfile.save();
            }
        }

        res.json({ message: 'Booking status updated successfully.', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    getBookings,
    updateBookingStatus,
    uploadPortfolioItem,
    addPortfolioItem,
    deletePortfolioItem,
    searchPhotographers,
    setUnavailableDates
};
