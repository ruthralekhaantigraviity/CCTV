require('dotenv').config();
const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
const User = require('./models/User');

async function dump() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision');
        console.log('Connected to DB');

        const allAttendance = await Attendance.find().populate('employee', 'name email role');
        console.log(`Found ${allAttendance.length} attendance records total.`);

        allAttendance.forEach((a, i) => {
            console.log(`\nRecord ${i + 1}:`);
            console.log(`  Employee: ${a.employee?.name} (${a.employee?.email})`);
            console.log(`  Role: ${a.employee?.role}`);
            console.log(`  Date (field): ${a.date}`);
            console.log(`  ClockIn: ${a.clockIn}`);
            console.log(`  Status: ${a.status}`);
        });

        const today = new Date().toISOString().split('T')[0];
        console.log(`\nToday (UTC): ${today}`);
        
        const filtered = allAttendance.filter(a => a.date === today);
        console.log(`Records matching date ${today}: ${filtered.length}`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

dump();
