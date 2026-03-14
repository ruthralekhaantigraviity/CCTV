const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create a new job request
router.post('/', async (req, res) => {
    try {
        const { customerName, customerPhone, customerAddress, serviceType, date, timeSlot, problemDescription } = req.body;
        const newJob = new Job({
            customerName,
            customerPhone,
            customerAddress,
            serviceType,
            date,
            timeSlot,
            problemDescription
        });
        const savedJob = await newJob.save();

        // Create notification for Admin & Employees (Robust alerts)
        try {
            const admin = await User.findOne({ email: 'admin@sv.com' });
            if (admin) {
                await Notification.create({
                    recipientRole: 'admin',
                    recipient: admin._id,
                    message: `New booking request from ${customerName}`,
                    type: 'booking',
                    relatedId: savedJob._id
                });
            }

            const employees = await User.find({ role: 'employee' });
            for (const emp of employees) {
                await Notification.create({
                    recipient: emp._id,
                    recipientRole: 'employee',
                    message: `New job available: ${serviceType} in ${customerAddress}`,
                    type: 'booking',
                    relatedId: savedJob._id
                });
            }
        } catch (notifyError) {
            console.error('Notification dispatch failed:', notifyError.message);
            // We don't throw here so the user still sees a successful booking
        }

        res.status(201).json({ success: true, data: savedJob });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Get all jobs (Employee view)
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().populate('assignedEmployee', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Assign a job to a technician
router.patch('/:id/assign', async (req, res) => {
    try {
        const { employeeId } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        job.assignedEmployee = employeeId;
        job.status = 'assigned';
        job.acceptedAt = new Date();
        await job.save();

        // Notify the specific employee
        await Notification.create({
            recipient: employeeId,
            recipientRole: 'employee',
            message: `You have been assigned to a new job: ${job.serviceType}`,
            type: 'assignment',
            relatedId: job._id
        });

        res.json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Accept a job (Employee self-accept)
router.patch('/:id/accept', async (req, res) => {
    try {
        const { employeeId } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        if (job.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Job already claimed or assigned' });
        }

        job.assignedEmployee = employeeId;
        job.status = 'claimed';
        job.acceptedAt = new Date();
        await job.save();

        // Notify Admin that someone claimed the job
        try {
            const admin = await User.findOne({ email: 'admin@sv.com' });
            if (admin) {
                const employee = await User.findById(employeeId);
                await Notification.create({
                    recipientRole: 'admin',
                    recipient: admin._id,
                    message: `${employee?.name || 'An employee'} has claimed the job for ${job.serviceType}. Please finalize assignment.`,
                    type: 'status_change',
                    relatedId: job._id
                });
            }
        } catch (err) {
            console.error('Admin notification failed:', err.message);
        }

        res.json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Update job status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, completionImage } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        job.status = status;
        if (status === 'progress') job.visitedAt = new Date();
        if (status === 'completed') {
            job.completedAt = new Date();
            if (completionImage) job.completionImage = completionImage;
        }

        await job.save();
        res.json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
