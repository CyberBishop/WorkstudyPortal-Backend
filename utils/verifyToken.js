const getCookie = require("./getCookie");

let verifyToken = async (headers) => {
	const token = getCookie({ name: "jwt", headers: headers });

	if (token === undefined || token === null || token === "") {
		return { error: "Unauthorized" };
	}
	const payload = jwt.verify(token, JWT_SECRET);
	console.log(payload);
	retuen(payload);
};

module.exports = verifyToken;
