const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
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

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: finalRole
        });

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
                    avatar: user.avatar,
                    joinedDate: user.createdAt
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
        const loginId = credential || email;

        const user = await User.findOne({
            $or: [
                { email: loginId },
                { employeeId: loginId }
            ]
        }).select('+password');

        if (user && (await user.matchPassword(password))) {
            if (user.isVerified === false) {
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
                        console.log(`[Attendance] Auto-punch in for ${user.name} on login`);
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
                    avatar: user.avatar,
                    joinedDate: user.createdAt
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
                    avatar: user.avatar,
                    joinedDate: user.createdAt
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
                avatar: user.avatar,
                joinedDate: user.createdAt
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

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: 'Email already registered. Use a different email.' });
        }

        const idExists = await User.findOne({ employeeId });
        if (idExists) {
            return res.status(400).json({ success: false, message: 'Employee ID already exists. Use a unique ID.' });
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
        res.json({ success: true, message: 'Employee removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
