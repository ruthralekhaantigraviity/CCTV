require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: function(origin, callback){
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/services', require('./routes/services'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/products', require('./routes/products'));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'SecureVision API is running',
        timestamp: new Date(),
        routes: ['auth', 'jobs', 'notifications', 'attendance', 'contact', 'services']
    });
});

// 404 handler
app.use((req, res) => {
    console.log(`[404] No match for ${req.method} ${req.url}`);
    res.status(404).json({ success: false, message: 'API Route not found on SecureVision Backend' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 SecureVision API server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;