const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    experience: { type: String, required: true },
    coverLetter: { type: String, required: true },
    resumeUrl: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
