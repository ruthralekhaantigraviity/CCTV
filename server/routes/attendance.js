const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// @desc    Punch in/out (Employee)
// @route   POST /api/attendance/punch
// @access  Private/Employee
router.post('/punch', protect, async (req, res) => {
    try {
        const { date, time, type, location } = req.body;
        let attendance = await Attendance.findOne({ employee: req.user.id, date });

        if (!attendance) {
            if (type === 'in') {
                attendance = await Attendance.create({
                    employee: req.user.id,
                    date,
                    punchIn: time,
                    location
                });
            } else {
                return res.status(400).json({ success: false, message: 'Must punch in first' });
            }
        } else {
            if (type === 'out') {
                attendance.punchOut = time;
                await attendance.save();
            } else {
                return res.status(400).json({ success: false, message: 'Already punched in for today' });
            }
        }

        res.json({ success: true, attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get all attendance (Admin)
// @route   GET /api/attendance
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const attendance = await Attendance.find().populate('employee', 'name email');
        res.json({ success: true, attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get employee attendance summary
// @route   GET /api/attendance/me
// @access  Private/Employee
router.get('/me', protect, async (req, res) => {
    try {
        const attendance = await Attendance.find({ employee: req.user.id });
        res.json({ success: true, attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
