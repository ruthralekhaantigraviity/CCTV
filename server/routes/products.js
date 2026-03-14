const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Create new product
// @route   POST /api/products
router.post('/', async (req, res) => {
    try {
        // Map frontend 'quantity' to backend 'stockQuantity'
        const productData = {
            ...req.body,
            stockQuantity: req.body.quantity || 0,
            image: req.body.imagePreview // Map frontend preview to backend image field
        };
        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'SKU already exists' });
        }
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Update product
// @route   PUT /api/products/:id
router.put('/:id', async (req, res) => {
    try {
        const productData = { ...req.body };
        if (req.body.quantity !== undefined) {
            productData.stockQuantity = req.body.quantity;
        }
        if (req.body.imagePreview !== undefined) {
            productData.image = req.body.imagePreview;
        }

        const product = await Product.findByIdAndUpdate(req.params.id, productData, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;
