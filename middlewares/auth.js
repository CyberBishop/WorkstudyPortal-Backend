require('dotenv').config();
const jwt = require('jsonwebtoken');

const checkHeaders = (req, res, next) => {
    try {
        // Check if authorization header exists
        if (!req.headers.authorization) {
            return res.status(400).json({ error: 'No authorization header' });
        }

        // Parse token from header
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: 'Malformed auth header' });
        }

        // Verify token and store user data in request object
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(400).json({ error: 'Token verification failed' });
        }

        req.user = payload; // Store user data in the request object
        next();
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Middleware for authorization (checks if user is logged in)
const isLoggedIn = (req, res, next) => {
    checkHeaders(req, res, next);
};

// Middleware for authorization (checks if user is an admin)
const isAdmin = (req, res, next) => {
    checkHeaders(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        next();
    });
};

// Export the middleware functions
module.exports = { isLoggedIn, isAdmin };
