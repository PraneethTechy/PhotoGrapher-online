

const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
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

const getBookingsByUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const bookings = await Booking.find({ user: userId })
            .populate('photographer', 'user categories')
            .sort({ date: -1 });
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getBookingsByPhotographer = async (req, res) => {
    try {
        const photographerId = req.user.userId; // assuming req.user.userId is the photographer's user _id
        // Find the photographer profile
        const photographerProfile = await require('../models/Photographer').findOne({ user: photographerId });
        if (!photographerProfile) {
            return res.status(404).json({ message: 'Photographer profile not found.' });
        }
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
        const { status } = req.body; // expected: 'approved', 'rejected', 'completed'

        // Only allow valid status values
        const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        // Find and update the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        // Optionally: Only allow the photographer or admin to update
        // (Assumes req.user.role and req.user.userId are set by authMiddleware)
        if (
            req.user.role === 'photographer' &&
            String(booking.photographer) !== String((await require('../models/Photographer').findOne({ user: req.user.userId }))._id)
        ) {
            return res.status(403).json({ message: 'Not authorized to update this booking.' });
        }

        booking.status = status;
        await booking.save();

        res.json({ message: 'Booking status updated successfully.', booking });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    createBooking,
    getBookingsByUser,
    getBookingsByPhotographer,
    updateBookingStatus
};
