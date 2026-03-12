const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// @desc    Submit a leave request (Employee)
// @route   POST /api/leave
// @access  Private/Employee
router.post('/', protect, async (req, res) => {
    try {
        const { leaveType, startDate, endDate, days, reason } = req.body;
        console.log('--- NEW LEAVE SUBMISSION (c6931ae) ---');
        console.log('User:', req.user ? req.user.id : 'No user defined in request');
        console.log('Body:', req.body);

        if (!startDate || !endDate || !days || !reason) {
            console.log('Validation Error: Missing fields');
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const leave = await Leave.create({
            employee: req.user.id,
            leaveType: leaveType || 'Casual Leave',
            startDate,
            endDate,
            days,
            reason,
        });

        const populated = await leave.populate('employee', 'name email');
        res.status(201).json({ success: true, data: populated });
    } catch (err) {
        console.error('Leave Submission Caught Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get my leave requests (Employee)
// @route   GET /api/leave/me
// @access  Private/Employee
router.get('/me', protect, async (req, res) => {
    try {
        const leaves = await Leave.find({ employee: req.user.id })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: leaves });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Get all leave requests (Admin)
// @route   GET /api/leave
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('employee', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: leaves });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Approve or Reject a leave request (Admin)
// @route   PATCH /api/leave/:id
// @access  Private/Admin
router.patch('/:id', protect, admin, async (req, res) => {
    try {
        const { status, adminNote } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status, adminNote: adminNote || '' },
            { new: true }
        ).populate('employee', 'name email');

        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        res.json({ success: true, data: leave });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Delete a leave request (Employee own / Admin)
// @route   DELETE /api/leave/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ success: false, message: 'Not found' });

        // Only the employee or an admin can delete
        if (leave.employee.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await leave.deleteOne();
        res.json({ success: true, message: 'Leave request deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
