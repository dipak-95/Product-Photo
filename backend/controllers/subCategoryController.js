const asyncHandler = require('express-async-handler');
const SubCategory = require('../models/SubCategory');

// @desc    Get all sub-categories
// @route   GET /api/subcategories
// @access  Public
const getSubCategories = asyncHandler(async (req, res) => {
    const subCategories = await SubCategory.find({}).populate('mainCategoryId', 'name');
    res.json(subCategories);
});

// @desc    Get sub-categories by Main Category ID
// @route   GET /api/subcategories/main/:mainCategoryId
// @access  Public
const getSubCategoriesByMainId = asyncHandler(async (req, res) => {
    const subCategories = await SubCategory.find({ mainCategoryId: req.params.mainCategoryId });
    res.json(subCategories);
});

// @desc    Create a sub-category
// @route   POST /api/subcategories
// @access  Private/Admin
const createSubCategory = asyncHandler(async (req, res) => {
    const { name, mainCategoryId, imageUrl } = req.body;

    const subCategory = new SubCategory({
        name,
        mainCategoryId,
        imageUrl,
    });

    const createdSubCategory = await subCategory.save();
    res.status(201).json(createdSubCategory);
});

// @desc    Delete a sub-category
// @route   DELETE /api/subcategories/:id
// @access  Private/Admin
const deleteSubCategory = asyncHandler(async (req, res) => {
    const subCategory = await SubCategory.findById(req.params.id);

    if (subCategory) {
        await SubCategory.deleteOne({ _id: req.params.id });
        res.json({ message: 'Sub-Category removed' });
    } else {
        res.status(404);
        throw new Error('Sub-Category not found');
    }
});

// @desc    Update a sub-category
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
const updateSubCategory = asyncHandler(async (req, res) => {
    const { name, mainCategoryId, imageUrl } = req.body;

    const subCategory = await SubCategory.findById(req.params.id);

    if (subCategory) {
        subCategory.name = name || subCategory.name;
        subCategory.imageUrl = imageUrl || subCategory.imageUrl;
        subCategory.mainCategoryId = mainCategoryId || subCategory.mainCategoryId;

        const updatedSubCategory = await subCategory.save();
        res.json(updatedSubCategory);
    } else {
        res.status(404);
        throw new Error('Sub-Category not found');
    }
});

module.exports = {
    getSubCategories,
    getSubCategoriesByMainId,
    createSubCategory,
    deleteSubCategory,
    updateSubCategory,
};
