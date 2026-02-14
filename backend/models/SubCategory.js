const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    imageUrl: {
        type: String,
    },
}, {
    timestamps: true,
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
