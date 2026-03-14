const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const sendEmail = require('../utils/sendEmail');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'securevision_secret_123', {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, role, adminSecret } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Handle Admin Registration
        let finalRole = 'user';
        if (role === 'admin') {
            const masterSecret = process.env.ADMIN_SECRET || 'SV_ADMIN_2026';
            if (adminSecret !== masterSecret) {
                return res.status(401).json({ success: false, message: 'Invalid Admin Authorization Secret' });
            }
            finalRole = 'admin';
        }

        const verificationToken = crypto.randomBytes(20).toString('hex');

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: finalRole,
            verificationToken
        });

        // Send Verification Email
        const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
        const message = `Please verify your PreciseCCTV account by clicking the link: \n\n ${verifyUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Account Verification',
                message
            });
        } catch (emailErr) {
            console.error('Email could not be sent', emailErr);
        }

        if (user) {
            res.status(201).json({
                success: true,
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, credential, password } = req.body;
        const loginId = credential || email; // Support both old 'email' field and new 'credential' field

        const user = await User.findOne({
            $or: [
                { email: loginId },
                { employeeId: loginId }
            ]
        }).select('+password');

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ success: false, message: 'Please verify your email before logging in' });
            }
            if (user.role === 'employee') {
                try {
                    const now = new Date();
                    const today = now.toISOString().split('T')[0];
                    
                    let attendance = await Attendance.findOne({ employee: user._id, date: today });
                    
                    if (!attendance) {
                        await Attendance.create({
                            employee: user._id,
                            date: today,
                            clockIn: now.toISOString(),
                            status: 'Present'
                        });
                        console.log(`[Attendance] Auto-punch in for ${user.name} (${user.email}) on login at ${now.toLocaleTimeString()}`);
                    } else {
                        console.log(`[Attendance] Record already exists for ${user.name} on ${today}`);
                    }
                } catch (attendanceError) {
                    console.error('[Attendance Error] Auto-attendance failed:', attendanceError.message);
                }
            }

            res.json({
                success: true,
                token: generateToken(user._id),
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        await user.save();
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get all employees
// @route   GET /api/auth/employees
// @access  Private/Admin
router.get('/employees', protect, admin, async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password');
        res.json({ success: true, data: employees });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Register employee (Admin only)
// @route   POST /api/auth/employees
// @access  Private/Admin
router.post('/employees', protect, admin, async (req, res) => {
    try {
        const { name, email, phone, password, role = 'employee', employeeId } = req.body;

        const userExists = await User.findOne({ 
            $or: [
                { email },
                { employeeId: employeeId }
            ]
        });
        
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User or Employee ID already exists' });
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role,
            employeeId
        });

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Update employee (Admin only)
// @route   PUT /api/auth/employees/:id
// @access  Private/Admin
router.put('/employees/:id', protect, admin, async (req, res) => {
    try {
        const { name, email, phone, role, employeeId, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (role) user.role = role;
        if (employeeId) user.employeeId = employeeId;
        if (password) user.password = password;

        await user.save();

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                employeeId: user.employeeId
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Delete employee (Admin only)
// @route   DELETE /api/auth/employees/:id
// @access  Private/Admin
router.delete('/employees/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Employee removed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ success: true, message: 'Email verified successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Create reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
        const message = `You are receiving this email because you requested a password reset. Please click on the link to reset your password: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message
            });
            res.json({ success: true, message: 'Email sent' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
router.put('/resetpassword/:token', async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
