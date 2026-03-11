require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision_db');
        console.log('Connected to MongoDB');

        const email = 'admin@securevision.com';
        const password = 'admin123';

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists. Updating password...');
            existingAdmin.password = password;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
        } else {
            console.log('Creating new temporary admin...');
            await User.create({
                name: 'Temporary Admin',
                email: email,
                phone: '1234567890',
                password: password,
                role: 'admin'
            });
        }

        console.log('--- ADMIN CREDENTIALS ---');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        console.log('-------------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();
