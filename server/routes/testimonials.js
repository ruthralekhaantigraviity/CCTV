const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// GET all testimonials
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.json({ success: true, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET featured testimonials
router.get('/featured', async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ featured: true });
        res.json({ success: true, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
