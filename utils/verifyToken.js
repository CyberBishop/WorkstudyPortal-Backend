require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const verifyToken = async (token) => {
	if (!token) {
		return { error: "Unauthorized" };
	}

	try {
		const payload = jwt.verify(token, JWT_SECRET);
		return payload;
	} catch (error) {
		return { error: "Invalid token" };
	}
};

module.exports = verifyToken;
