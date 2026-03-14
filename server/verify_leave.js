require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Leave = require('./models/Leave'); // Assuming the model is named Leave

async function verifyLeave() {
    console.log('--- STARTING LEAVE VERIFICATION ---');
    
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision');
        console.log('✅ Connected to DB');

        // 1. Find the test employee
        const employee = await User.findOne({ email: 'technician01@securevision.com' });
        if (!employee) {
            console.log('❌ Employee technician01@securevision.com not found!');
            return;
        }
        console.log(`✅ Using employee: ${employee.name} (${employee.email})`);

        // 2. Clean up any existing test leaves
        const reason = 'TEST LEAVE - VERIFICATION';
        await Leave.deleteMany({ employee: employee._id, reason: reason });
        console.log('✅ Cleaned up old test leaves');

        // 3. Simulate leave application (directly via model)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 2);

        const leaveRequest = await Leave.create({
            employee: employee._id,
            leaveType: 'Sick Leave',
            startDate,
            endDate,
            days: 3,
            reason: reason,
            status: 'pending'
        });
        console.log('✅ Simulated leave application created');

        // 4. Verify leave exists in the general fetch (what the admin sees)
        const allLeaves = await Leave.find({}).populate('employee', 'name email');
        const found = allLeaves.find(l => l._id.equals(leaveRequest._id));

        if (found) {
            console.log('✅ Leave record FOUND in Admin-level fetch:');
            console.log('   ID:', found._id);
            console.log('   Employee:', found.employee.name);
            console.log('   Status:', found.status);
            console.log('   Reason:', found.reason);
        } else {
            console.log('❌ Leave record NOT FOUND in Admin-level fetch!');
        }

    } catch (err) {
        console.error('❌ Leave verification failed:', err);
    } finally {
        await mongoose.disconnect();
        console.log('--- LEAVE VERIFICATION COMPLETE ---');
    }
}

verifyLeave();
