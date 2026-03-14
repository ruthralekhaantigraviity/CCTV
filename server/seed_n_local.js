const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function create() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/securevision_db');
        console.log('Connected to local DB');

        const userSchema = new mongoose.Schema({
            name: String,
            email: { type: String, unique: true },
            password: { type: String, select: false },
            role: String,
            employeeId: String,
            phone: String
        });

        // Add pre-save middleware to hash password
        userSchema.pre('save', async function () {
            if (!this.isModified('password')) return;
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        });

        const User = mongoose.model('User', userSchema);

        // Check if exists
        const exists = await User.findOne({ email: 'n@gmail.com' });
        if (exists) {
            console.log('User n@gmail.com already exists locally');
        } else {
            await User.create({
                name: 'Nick',
                email: 'n@gmail.com',
                password: 'password123', // I'll use a simple password for them to try
                role: 'employee',
                employeeId: 'EMP-N-101',
                phone: '1234567890'
            });
            console.log('User n@gmail.com created locally with password: password123');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

create();
