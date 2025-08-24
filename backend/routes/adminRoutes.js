const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Admin login
router.post('/login', adminController.login);


// Approve photographer
router.put('/photographers/:photographerId/approve', authMiddleware, roleMiddleware(['admin']), adminController.approvePhotographer);

// Reject photographer
router.delete('/photographers/:photographerId/reject', authMiddleware, roleMiddleware(['admin']), adminController.rejectPhotographer);

// Add photographer (admin creates directly)
router.post('/photographers', authMiddleware, roleMiddleware(['admin']), adminController.addPhotographer);

// Delete photographer
router.delete('/photographers/:photographerId', authMiddleware, roleMiddleware(['admin']), adminController.deletePhotographer);

// Get pending photographers
router.get('/pending-photographers', authMiddleware, roleMiddleware(['admin']), adminController.getPendingPhotographers);

// Get approved photographers
router.get('/approved-photographers', authMiddleware, roleMiddleware(['admin']), adminController.getApprovedPhotographers);

module.exports = router;
