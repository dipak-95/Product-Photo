const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const debug = async () => {
    try {
        console.log("Fetching categories with aggregation...");
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: 'subcategories', // This must match the actual collection name in MongoDB
                    localField: '_id',
                    foreignField: 'mainCategoryId',
                    as: 'subCategories'
                }
            }
        ]);

        console.log(JSON.stringify(categories, null, 2));

        console.log("Checking SubCategories directly...");
        const subs = await SubCategory.find({});
        console.log("Total SubCategories:", subs.length);
        if (subs.length > 0) {
            console.log("Sample SubCategory:", subs[0]);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debug();
