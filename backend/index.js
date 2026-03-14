require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connection placeholder (moved to startServer)

const fs = require('fs');
const path = require('path');

// Middleware
app.use((req, res, next) => {
    const authHeader = req.headers.authorization || 'NONE';
    const start = Date.now();
    
    // Intercept finish to log response status
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `[${new Date().toISOString()}] ${req.method} ${req.url} | STATUS: ${res.statusCode} | AUTH: ${authHeader.substring(0, 30)} | ${duration}ms\n`;
        fs.appendFileSync(path.join(__dirname, 'antigravity_server.log'), log);
        console.log(log.trim());
    });

    if (req.method === 'POST' && req.url.includes('/api/auth/employees')) {
        console.log('--- EMPLOYEE REGISTRATION DATA ---');
        console.log(JSON.stringify(req.body, null, 2));
        console.log('---------------------------------');
    }
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
app.get('/', (req, res) => {
    res.send('SecureVision Backend is ONLINE 🚀 (Check /api/health for status)');
});

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
    const errorLog = `[${new Date().toISOString()}] ERROR: ${err.message}\n${err.stack}\n`;
    fs.appendFileSync(path.join(__dirname, 'antigravity_server.log'), errorLog);
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const startServer = async () => {
    // 1. Start the HTTP server immediately so it's "Online"
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 SecureVision API server running on port ${PORT}`);
        console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // 2. Attempt DB connection in the background
    try {
        await connectDB();
    } catch (err) {
        console.error('⚠️ Server started but MongoDB connection failed:', err.message);
        console.error('   Please check your MongoDB Atlas IP Whitelist (add 0.0.0.0/0)');
    }
};

startServer();

module.exports = app;