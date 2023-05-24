// Require necessary modules
require('dotenv').config();
const jwt = require('jsonwebtoken');

const checkHeaders = async (req, res) => {
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
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(400).json({ error: 'Token verification failed' });
        }

        req.user = payload; // Store user data in the request object
    } catch (error) {
        console.log('An error occurred');
    }
};

// Middleware for authorization (checks if user is logged in)
const isLoggedIn = async (req, res, next) => {
    await checkHeaders(req, res);
    next();
};

// Middleware for authorization (checks if user is an admin)
const isAdmin = async (req, res, next) => {
    try {
        await checkHeaders(req, res);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
};

// Export the middleware functions
module.exports = { isLoggedIn, isAdmin };
