const getCookie = require("./getCookie");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

let verifyToken = async (cookie) => {
	const token = getCookie({ name: "token", headers: cookie });

	if (token === undefined || token === null || token === "") {
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
