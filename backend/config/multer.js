// config/multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Use authenticated user's ID for folder name
    const userId = req.user && req.user.userId ? req.user.userId : 'unknown';
        return {
            folder: `photographer_portfolio/${userId}`,
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'avi', 'webm'],
            // Only transform images, not videos
            transformation: file.mimetype.startsWith('image/') ? [{ width: 1200, height: 800, crop: 'limit' }] : undefined,
        };
    },
});

const upload = multer({ storage });

module.exports = upload;
