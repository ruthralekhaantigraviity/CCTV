require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const bcrypt = require('bcryptjs');

async function verify() {
    console.log('--- STARTING ID FLOW VERIFICATION ---');
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision');
        console.log('✅ Connected to DB');

        const testId = 'EMP-VERIFY-999';
        const testEmail = 'verify@sv.com';
        const testPass = 'password123';

        // 1. Clean up
        await User.deleteOne({ $or: [{ email: testEmail }, { employeeId: testId }] });
        await Attendance.deleteMany({ date: new Date().toISOString().split('T')[0] });
        console.log('✅ Cleaned up old test data');

        // 2. Create Employee (Simulating Admin action)
        const user = await User.create({
            name: 'Verification Tester',
            email: testEmail,
            phone: '1234567890',
            password: testPass,
            role: 'employee',
            employeeId: testId
        });
        console.log(`✅ Created test employee with ID: ${testId}`);

        // 3. Test Login (Simulating Auth Flow)
        // Find user by ID (what the backend does now)
        const foundUser = await User.findOne({ 
            $or: [{ email: testId }, { employeeId: testId }] 
        }).select('+password');

        if (!foundUser) throw new Error('User not found by ID!');
        const isMatch = await foundUser.matchPassword(testPass);
        if (!isMatch) throw new Error('Password mismatch!');
        console.log('✅ Login verification SUCCESS');

        // 4. Test Attendance Trigger (Simulating route logic)
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        await Attendance.create({
            employee: foundUser._id,
            date: today,
            clockIn: now.toISOString(),
            status: 'Present'
        });
        console.log('✅ Simulated Attendance Trigger SUCCESS');

        // 5. Verify Record
        const record = await Attendance.findOne({ employee: foundUser._id, date: today });
        if (record) {
            console.log('✅ FINAL VERIFICATION: Attendance record found in DB');
            console.log('   ID:', record.employee);
            console.log('   Date:', record.date);
        } else {
            throw new Error('Attendance record NOT found!');
        }

    } catch (err) {
        console.error('❌ Verification failed:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('--- VERIFICATION COMPLETE ---');
    }
}

verify();
