const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'photographer', 'admin'], default: 'user' },
    isApproved: { type: Boolean, default: true }, // Only relevant for photographers
    phone: String,
    address: String,
    profilePicture: { type: String }, // Cloudinary URL
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

