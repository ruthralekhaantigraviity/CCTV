require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const fs = require('fs');

async function dump() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision_db');
        const users = await User.find({}, 'email role name');
        fs.writeFileSync('user_dump.json', JSON.stringify(users, null, 2));
        console.log('Dump complete');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
dump();
