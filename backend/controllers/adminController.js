
const User = require('../models/User');
const Photographer = require('../models/Photographer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login (detected by email/credentials)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, role: 'admin' });
        if (!user) {
            return res.status(400).json({ message: 'Invalid admin credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid admin credentials.' });
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.MYSecretKey || 'mysecretkey',
            { expiresIn: '7d' }
        );
        res.json({
            message: 'Admin login successful',
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

// Approve photographer
const approvePhotographer = async (req, res) => {
    try {
        const { photographerId } = req.params;
        const photographer = await Photographer.findByIdAndUpdate(
            photographerId,
            { isApproved: true },
            { new: true }
        ).populate('user');
        if (!photographer) {
            return res.status(404).json({ message: 'Photographer not found.' });
        }
        // Also update the user isApproved field
        await User.findByIdAndUpdate(photographer.user._id, { isApproved: true });
        res.json({ message: 'Photographer approved.', photographer });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Reject photographer (delete profile and user)
const rejectPhotographer = async (req, res) => {
    try {
        const { photographerId } = req.params;
        const photographer = await Photographer.findByIdAndDelete(photographerId);
        if (!photographer) {
            return res.status(404).json({ message: 'Photographer not found.' });
        }
        // Also delete the user account
        await User.findByIdAndDelete(photographer.user);
        res.json({ message: 'Photographer rejected and deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Add photographer (admin creates photographer directly)
const addPhotographer = async (req, res) => {
    try {
        const { name, email, password, phone, address, categories } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: 'photographer',
            isApproved: true
        });
        await user.save();
        const photographer = new Photographer({
            user: user._id,
            categories,
            isApproved: true
        });
        await photographer.save();
        res.status(201).json({ message: 'Photographer added by admin.', photographer });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete photographer (admin deletes photographer and user)
const deletePhotographer = async (req, res) => {
    try {
        const { photographerId } = req.params;
        const photographer = await Photographer.findByIdAndDelete(photographerId);
        if (!photographer) {
            return res.status(404).json({ message: 'Photographer not found.' });
        }
        await User.findByIdAndDelete(photographer.user);
        res.json({ message: 'Photographer deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get pending photographers (not approved)
const getPendingPhotographers = async (req, res) => {
    try {
        const photographers = await Photographer.find({ isApproved: false }).populate('user');
        res.json({ photographers });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get approved photographers
const getApprovedPhotographers = async (req, res) => {
    try {
        const photographers = await Photographer.find({ isApproved: true }).populate('user');
        res.json({ photographers });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    login,
    approvePhotographer,
    rejectPhotographer,
    addPhotographer,
    deletePhotographer,
    getPendingPhotographers,
    getApprovedPhotographers
};
