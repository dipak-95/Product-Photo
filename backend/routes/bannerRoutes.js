const express = require('express');
const router = express.Router();
const {
    getBanners,
    createBanner,
    deleteBanner,
    toggleBannerStatus,
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBanners).post(protect, admin, createBanner);
router.route('/:id').delete(protect, admin, deleteBanner);
router.route('/:id/status').put(protect, admin, toggleBannerStatus);

module.exports = router;
