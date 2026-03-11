const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    punchIn: {
        type: String, // HH:mm:ss
    },
    punchOut: {
        type: String, // HH:mm:ss
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half-day'],
        default: 'Present'
    },
    location: {
        lat: Number,
        lng: Number,
        address: String
    }
}, { timestamps: true });

// Ensure one record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
