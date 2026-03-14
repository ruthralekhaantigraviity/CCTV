const fs = require('fs');
const path = require('path');

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        const msg = `❌ ADMIN FAILURE: User ${req.user ? req.user._id : 'UNKNOWN'} has role ${req.user ? req.user.role : 'NONE'}. Required: admin`;
        console.error(msg);
        try {
            fs.appendFileSync(path.join(__dirname, '..', 'antigravity_server.log'), msg + '\n');
        } catch(e) {}
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};

module.exports = { admin };
