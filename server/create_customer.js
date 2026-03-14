require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function run() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision');

    // Check if user exists
    const existing = await User.findOne({ email: 'ruthralekha1212@gmail.com' });
    if (existing) {
        console.log('User already exists. Role:', existing.role);
        // Reset their password to 123123
        existing.password = '123123';
        await existing.save();
        console.log('✅ Password reset to 123123 for', existing.email);
    } else {
        const user = await User.create({
            name: 'Ruthralekha',
            email: 'ruthralekha1212@gmail.com',
            phone: '9999999999',
            password: '123123',
            role: 'user'
        });
        console.log('✅ Customer created:', user.email, '| role:', user.role);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
