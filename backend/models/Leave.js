const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    leaveType: {
        type: String,
        enum: ['Sick Leave', 'Casual Leave', 'Privilege Leave', 'Emergency Leave'],
        default: 'Casual Leave',
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    days: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminNote: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
