const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Step 1: Authorization token missing' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'securevision_secret_123');
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            const msg = `❌ AUTH FAILURE: Token ID ${decoded.id} not found in local MongoDB. User must log out/in.`;
            console.error(msg);
            try {
                fs.appendFileSync(path.join(__dirname, '..', 'antigravity_server.log'), `[${new Date().toISOString()}] ${msg}\n`);
            } catch(e) {}
            return res.status(401).json({ success: false, message: 'User DB Mismatch. Please LOG OUT and LOG IN again to sync your local account.' });
        }
        
        next();
    } catch (err) {
        const msg = `❌ AUTH ERROR: ${err.message}`;
        console.error(msg);
        try {
            fs.appendFileSync(path.join(__dirname, '..', 'antigravity_server.log'), `[${new Date().toISOString()}] ${msg} | Token: ${token ? token.substring(0, 10) : 'NONE'}\n`);
        } catch(e) {}
        return res.status(401).json({ success: false, message: 'Invalid Session. Please LOG OUT and LOG IN again.' });
    }
};
