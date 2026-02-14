const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500);
        throw new Error('Server Error: Failed to fetch banners');
    }
});

// @desc    Add a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        res.status(400);
        throw new Error('Please provide an image URL');
    }

    const banner = new Banner({
        imageUrl,
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
        await Banner.deleteOne({ _id: req.params.id });
        res.json({ message: 'Banner removed' });
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

// @desc    Toggle banner status
// @route   PUT /api/banners/:id/status
// @access  Private/Admin
const toggleBannerStatus = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);

    if (banner) {
        banner.isActive = !banner.isActive;
        const updatedBanner = await banner.save();
        res.json(updatedBanner);
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

module.exports = {
    getBanners,
    createBanner,
    deleteBanner,
    toggleBannerStatus,
};
