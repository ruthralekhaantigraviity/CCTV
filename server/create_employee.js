require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createEmployee() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/securevision');

    const existing = await User.findOne({ email: 'technician01@securevision.com' });
    if (existing) {
        console.log('Employee already exists!');
        console.log('Email:   technician01@securevision.com');
        console.log('Password: Tech@1234');
        await mongoose.disconnect();
        return;
    }

    const employee = await User.create({
        name: 'Technician 01',
        email: 'technician01@securevision.com',
        phone: '9876543210',
        password: 'Tech@1234',
        role: 'employee'
    });

    console.log('✅ Employee created successfully!');
    console.log('Name:    ', employee.name);
    console.log('Email:    technician01@securevision.com');
    console.log('Password: Tech@1234');
    console.log('Role:    ', employee.role);

    await mongoose.disconnect();
}

createEmployee().catch(console.error);
