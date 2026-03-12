const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// @desc    Submit a contact form (Public)
// @route   POST /api/contact
router.post(
    '/',
    [
        body('name').notEmpty().trim().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').notEmpty().withMessage('Phone is required'),
        body('service').notEmpty().withMessage('Service selection is required'),
        body('message').notEmpty().withMessage('Message is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { name, email, phone, service, message } = req.body;
            const contact = new Contact({ name, email, phone, service, message });
            await contact.save();

            // Send confirmation email to customer
            try {
                if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                    await transporter.sendMail({
                        from: `"SecureVision CCTV" <${process.env.EMAIL_USER}>`,
                        to: email,
                        subject: 'Thank you for contacting SecureVision CCTV Solutions',
                        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #0a1628; color: #fff; padding: 30px; border-radius: 10px;">
                  <h2 style="color: #1e90ff;">SecureVision CCTV Solutions</h2>
                  <p>Dear <strong>${name}</strong>,</p>
                  <p>Thank you for reaching out to us! We have received your inquiry about <strong>${service}</strong>.</p>
                  <p>Our team will get back to you within 24 hours.</p>
                  <hr style="border-color: #1e90ff;" />
                  <p><strong>Your Message:</strong></p>
                  <p>${message}</p>
                  <hr style="border-color: #1e90ff;" />
                  <p>📞 Emergency: +1 (800) 123-4567</p>
                  <p style="color:#aaa;">SecureVision CCTV Solutions – Protecting What Matters Most</p>
                </div>
              `,
                    });

                    // Notify business owner
                    await transporter.sendMail({
                        from: `"SecureVision Website" <${process.env.EMAIL_USER}>`,
                        to: process.env.EMAIL_TO,
                        subject: `New Contact Form Submission from ${name}`,
                        html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Message:</strong> ${message}</p>
              `,
                    });
                }
            } catch (emailError) {
                console.error('Email send failed:', emailError.message);
            }

            res.status(201).json({
                success: true,
                message: 'Your message has been sent successfully!',
                data: contact,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error. Please try again.' });
        }
    }
);

// @desc    Get all enquiries (Admin)
// @route   GET /api/contact
router.get('/', protect, admin, async (req, res) => {
    try {
        const enquiries = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, data: enquiries });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Update enquiry status (Admin)
// @route   PATCH /api/contact/:id
router.patch('/:id', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const enquiry = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!enquiry) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: enquiry });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @desc    Delete enquiry (Admin)
// @route   DELETE /api/contact/:id
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const enquiry = await Contact.findByIdAndDelete(req.params.id);
        if (!enquiry) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Enquiry deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
