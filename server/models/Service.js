const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'camera' },
    image: { type: String, default: '' },
    benefits: [{ type: String }],
    steps: [{
        title: { type: String },
        description: { type: String },
    }],
    faqs: [{
        question: { type: String },
        answer: { type: String },
    }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
