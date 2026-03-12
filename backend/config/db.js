const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('📡 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error; // Rethrow to let index.js handle the crash
  }
};

module.exports = connectDB;
