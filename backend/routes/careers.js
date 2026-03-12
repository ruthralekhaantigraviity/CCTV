const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Career = require('../models/Career');

router.post(
    '/',
    [
        body('name').notEmpty().trim().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').notEmpty().withMessage('Phone is required'),
        body('position').notEmpty().withMessage('Position is required'),
        body('experience').notEmpty().withMessage('Experience is required'),
        body('coverLetter').notEmpty().withMessage('Cover letter is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        try {
            const career = new Career(req.body);
            await career.save();
            res.status(201).json({ success: true, message: 'Application submitted successfully!', data: career });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

router.get('/', async (req, res) => {
    try {
        const applications = await Career.find().sort({ createdAt: -1 });
        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
