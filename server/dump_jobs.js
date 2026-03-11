const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

async function dumpJobs() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision_db';
        console.log('Connecting to:', mongoUri);
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        const jobs = await Job.find().sort({ createdAt: -1 });
        console.log('JOBS_COUNT:', jobs.length);
        if (jobs.length > 0) {
            console.log('RECENT_JOBS:', JSON.stringify(jobs.slice(0, 5), null, 2));
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

dumpJobs();
