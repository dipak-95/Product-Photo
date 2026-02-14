const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');
const Product = require('./models/Product');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const data = [
    {
        name: "Kitchenware",
        subCategories: [
            "Cookware (Pan, Kadai, Tawa)",
            "Dinnerware (Plates, Bowls)",
            "Cutlery (Spoon, Knife, Fork)",
            "Storage Containers",
            "Water Bottles & Flasks",
            "Kitchen Tools (Peeler, Grater)",
            "Bakeware (Cake Mould, Tray)",
            "Gas Stove Accessories",
            "Kitchen Organizers",
            "Chopping Boards"
        ]
    },
    {
        name: "Plastic",
        subCategories: [
            "Plastic Containers",
            "Water Bottles",
            "Storage Boxes",
            "Plastic Buckets & Mugs",
            "Plastic Chairs",
            "Household Plastic Items",
            "Lunch Boxes",
            "Plastic Trays",
            "Plastic Kitchen Tools",
            "Industrial Plastic Products"
        ]
    },
    {
        name: "Fashion",
        subCategories: [
            "Shirts",
            "T-Shirts",
            "Pants",
            "Jeans",
            "Watches",
            "Footwear",
            "Jackets",
            "Bags",
            "Sunglasses",
            "Ethnic Wear"
        ]
    },
    {
        name: "Cosmetic",
        subCategories: [
            "Lipstick",
            "Foundation",
            "Compact Powder",
            "Mascara",
            "Eyeliner",
            "Blush",
            "Nail Polish",
            "Makeup Kit",
            "Concealer",
            "Makeup Brushes"
        ]
    },
    {
        name: "Skincare",
        subCategories: [
            "Face Wash",
            "Face Cream",
            "Serum",
            "Sunscreen",
            "Moisturizer",
            "Face Mask",
            "Toner",
            "Scrub",
            "Under Eye Cream",
            "Body Lotion"
        ]
    },
    {
        name: "Haircare",
        subCategories: [
            "Shampoo",
            "Conditioner",
            "Hair Oil",
            "Hair Serum",
            "Hair Mask",
            "Hair Spray",
            "Hair Gel",
            "Hair Color",
            "Hair Dryer",
            "Hair Straightener"
        ]
    }
];

const seedData = async () => {
    await connectDB();

    try {
        console.log('Clearing old data...');
        await Product.deleteMany({});
        await SubCategory.deleteMany({});
        await Category.deleteMany({});
        console.log('Old data cleared.');

        console.log('Seeding new data...');

        for (const catData of data) {
            // Create Main Category
            const category = await Category.create({
                name: catData.name,
                imageUrl: 'https://placehold.co/400' // Placeholder
            });
            console.log(`Created Category: ${category.name}`);

            // Create Sub Categories
            const subCatPromises = catData.subCategories.map(subName => {
                return SubCategory.create({
                    name: subName,
                    mainCategoryId: category._id,
                    imageUrl: 'https://placehold.co/400' // Placeholder
                });
            });

            await Promise.all(subCatPromises);
            console.log(`  - Added ${catData.subCategories.length} sub-categories for ${category.name}`);
        }

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
