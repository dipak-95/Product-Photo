const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin, getDashboardStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.post('/', registerAdmin);
router.get('/stats', protect, admin, getDashboardStats);

module.exports = router;
