const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    // Filter based on 'type' query parameter: 'premium' or 'standard'
    // Default to 'standard' (isPremium: false) if not specified
    let isPremiumFilter = false;
    if (req.query.type === 'premium') {
        isPremiumFilter = true;
    }

    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    // Combine keyword search with premium filter
    const query = { ...keyword, isPremium: isPremiumFilter };

    if (req.query.categoryId) {
        query.mainCategoryId = req.query.categoryId;
    }
    if (req.query.subCategoryId) {
        query.subCategoryId = req.query.subCategoryId;
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate('mainCategoryId', 'name');

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const {
        title,
        imageUrl,
        prompt,
        mainCategoryId,
        subCategoryId,
        isPremium,
    } = req.body;

    const product = new Product({
        title,
        imageUrl,
        prompt,
        mainCategoryId,
        subCategoryId,
        isPremium,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        title,
        imageUrl,
        prompt,
        mainCategoryId,
        subCategoryId,
        isPremium,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.title = title || product.title;
        product.imageUrl = imageUrl || product.imageUrl;
        product.prompt = prompt || product.prompt;
        product.mainCategoryId = mainCategoryId || product.mainCategoryId;
        product.subCategoryId = subCategoryId || product.subCategoryId;
        product.isPremium = isPremium || product.isPremium;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get trending products logic
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = asyncHandler(async (req, res) => {
    // Launch date: Jan 1, 2026
    const launchDate = new Date('2026-01-01T00:00:00.000Z');
    const currentDate = new Date();

    // Calculate full days difference
    const timeDiff = currentDate.getTime() - launchDate.getTime();
    const dayNumber = Math.floor(timeDiff / (1000 * 3600 * 24));

    // Get all non-premium products (or all?) - User said "Daily 6 products"
    // Assuming from all products
    const products = await Product.find({});
    const totalProducts = products.length;

    if (totalProducts === 0) {
        res.json([]);
        return;
    }

    // Ensure dayNumber is not negative
    const safeDayNumber = Math.max(0, dayNumber);

    // If we have fewer than 6 products, just return them all without duplication
    if (totalProducts <= 6) {
        res.json(products);
        return;
    }

    const startIndex = (safeDayNumber * 6) % totalProducts;

    let trendingProducts = [];
    for (let i = 0; i < 6; i++) {
        const index = (startIndex + i) % totalProducts;
        if (products[index]) {
            trendingProducts.push(products[index]);
        }
    }

    res.json(trendingProducts);
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getTrendingProducts,
};
