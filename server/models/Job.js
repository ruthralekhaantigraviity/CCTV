const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerAddress: { type: String, required: true },
    problemDescription: { type: String },
    serviceType: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    assignedEmployee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    acceptedAt: Date,
    visitedAt: Date,
    completedAt: Date,
    completionImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
