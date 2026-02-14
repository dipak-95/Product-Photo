const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    mainCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Category',
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'SubCategory',
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
