const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET single service by slug
router.get('/:slug', async (req, res) => {
    try {
        const service = await Service.findOne({ slug: req.params.slug });
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, data: service });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
