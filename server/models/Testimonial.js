const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    review: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    image: { type: String, default: '' },
    featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
