const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function verify() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/securevision_db');
        console.log('Connected to local DB');

        const userSchema = new mongoose.Schema({
            email: String,
            password: { type: String, select: false },
            role: String
        });
        
        userSchema.methods.matchPassword = async function (enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
        };

        const User = mongoose.model('User', userSchema);

        const user = await User.findOne({ email: 'n@gmail.com' }).select('+password');
        if (!user) {
            console.log('User n@gmail.com NOT FOUND');
        } else {
            console.log('User Found. Role:', user.role);
            const isMatch = await user.matchPassword('password123');
            console.log('Password "password123" matches:', isMatch);
            
            // Log the hash for debugging (carefully)
            console.log('Password hash starts with:', user.password.substring(0, 10));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
