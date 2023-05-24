const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;

const verifyToken = (token) => {
    if (!token) {
        return { error: 'Unauthorized' };
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return payload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return { error: 'Invalid token' };
    }
};

module.exports = verifyToken;
