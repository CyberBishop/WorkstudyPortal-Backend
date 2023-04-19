require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/verifyToken");

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const isLoggedIn = async (req, res, next) => {
	try {
		const cookie = req.headers.cookie;
		const token = await verifyToken(cookie);
		return next();
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: "An error occured" });
	}
};

// export custom middleware
module.exports = {
	isLoggedIn,
};
