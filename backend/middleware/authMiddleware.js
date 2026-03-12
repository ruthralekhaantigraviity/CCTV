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
            console.error('Auth Middleware: token valid but User not found in DB');
            return res.status(401).json({ success: false, message: 'User not found in database. Please log in again.' });
        }
        
        next();
    } catch (err) {
        console.error('Auth Middleware Verification Error:', err.message);
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
};
