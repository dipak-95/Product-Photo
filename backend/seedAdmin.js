const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedAdmin = async () => {
    try {
        await Admin.deleteMany();

        const adminUser = await Admin.create({
            email: 'admin@pearl.com',
            password: 'Pearl@123',
        });

        console.log('Admin User Created:', adminUser);
        console.log('Email: admin@pearl.com');
        console.log('Password: Pearl@123');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedAdmin();
