require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function list() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision_db');
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'name email role');
        console.log('--- User Directory ---');
        users.forEach(u => {
            console.log(`[${u.role}] ${u.name} <${u.email}>`);
        });
        console.log('---------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

list();
