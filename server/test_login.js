require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function run() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision');
    
    console.log("Looking for ruthralekha1212@gmail.com...");
    const user = await User.findOne({ email: 'ruthralekha1212@gmail.com' }).select('+password');
    
    if (!user) {
        console.log("❌ User not found in DB!");
    } else {
        console.log("✅ User found:", user.email);
        console.log("Role:", user.role);
        console.log("Password hash in DB:", user.password);
        
        const isMatch = await user.matchPassword('123123');
        console.log("Does '123123' match the hash?", isMatch);
    }

    await mongoose.disconnect();
}

run().catch(console.error);
