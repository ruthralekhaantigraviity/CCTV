require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function promote() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision_db');
        console.log('Connected to MongoDB');

        const email = 'kmruthra01@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ Successfully promoted ${email} to admin!`);
        console.log(`Current Role: ${user.role}`);
        process.exit(0);
    } catch (error) {
        console.error('Promotion error:', error);
        process.exit(1);
    }
}

promote();
