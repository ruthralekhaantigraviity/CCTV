const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'securevision_secret_123');
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            const msg = `❌ AUTH FAILURE: Token ID ${decoded.id} not found in local MongoDB. User must log out/in.`;
            console.error(msg);
            // We'll write to the same log file for consistency
            const logPath = require('path').join(__dirname, '..', 'backend', 'antigravity_server.log');
            try { require('fs').appendFileSync(logPath, msg + '\n'); } catch(e) {}
            return res.status(401).json({ success: false, message: 'User not found in local database. Please LOG OUT and LOG IN again.' });
        }
        
        next();
    } catch (err) {
        console.error('--- AUTH VERIFICATION FAILURE (SERVER) ---');
        console.error('Error:', err.message);
        console.error('Token:', token ? (token.substring(0, 10) + '...') : 'NONE');
        console.error('Secret Used:', process.env.JWT_SECRET || 'securevision_secret_123');
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
};
