const mongoose = require('mongoose');


const photographerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    portfolio: [{ type: String }], // URLs to photos/videos
    categories: [{ type: String }], // e.g., wedding, event, etc.
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    unavailableDates: [{ type: Date }], // Dates photographer is not available
    city: { type: String },
    state: { type: String },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Photographer', photographerSchema);

