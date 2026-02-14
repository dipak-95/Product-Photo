const express = require('express');
const router = express.Router();
const {
    getSubCategories,
    getSubCategoriesByMainId,
    createSubCategory,
    deleteSubCategory,
    updateSubCategory,
} = require('../controllers/subCategoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getSubCategories).post(protect, admin, createSubCategory);
router.route('/main/:mainCategoryId').get(getSubCategoriesByMainId);
router
    .route('/:id')
    .put(protect, admin, updateSubCategory)
    .delete(protect, admin, deleteSubCategory);

module.exports = router;
