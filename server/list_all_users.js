require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function list() {
    try {
        console.log('Using URI:', process.env.MONGO_URI || 'fallback');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision');
        console.log('Connected to DB');

        const users = await User.find({}, 'name email employeeId role');
        console.log('Total Users:', users.length);
        console.log(JSON.stringify(users, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

list();
