// Require necessary modules
require("dotenv").config();
const jwt = require("jsonwebtoken");

// Middleware for authorization (checks if user is logged in)
const isLoggedIn = async (req, res, next) => {
	try {
		// Check if authorization header exists
		if (!req.headers.authorization) {
			return res.status(400).json({ error: "No authorization header" });
		}

		// Parse token from header
		const token = req.headers.authorization.split(" ")[1];
		if (!token) {
			return res.status(400).json({ error: "Malformed auth header" });
		}

		// Verify token and store user data in request object
		const payload = await jwt.verify(token, process.env.JWT_SECRET);
		if (!payload) {
			return res.status(400).json({ error: "Token verification failed" });
		}
		req.user = payload;
		next();
	} catch (error) {
		res.status(400).json({ error });
	}
};

// Export the middleware function
module.exports = { isLoggedIn };
