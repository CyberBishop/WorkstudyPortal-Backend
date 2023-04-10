require("dotenv").config();
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const getCookie = require("../controllers/getCookie");
const { isLoggedIn } = require("../controllers/middleware"); // import isLoggedIn custom middleware

const Users = require("../models/user");
const { JWT_SECRET } = process.env;

//Login Route, verify user and get user token
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (user) {
			const valid = await bcrypt.compare(req.body.password, user.password);
			if (valid) {
				const token = await jwt.sign(
					{
						uuid: user.uuid,
						username: user.username,
						email: user.email,
						role: user.role,
						firstName: user.firstname,
						lastName: user.lastname,
					},
					JWT_SECRET
				);
				res.json({ token });
			} else {
				res.status(400).json({ error: "Invalid Username/Password" });
			}
		} else {
			res.status(400).json({ error: "Invalid Username/Password" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "An Error Occured" });
	}
});

//Signup Route
router.post("/register", async (req, res) => {
	try {
		req.body.password = await bcrypt.hash(req.body.password, 10);
		const uniqueRandomID = uuid.v4();
		req.body.uuid = uniqueRandomID;
		const user = await User.create(req.body);
		res.json({ message: "Account Created!" });
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: "An Error Occured" });
	}
});

//Route to verify jwt
router.get("/", async (req, res) => {
	const headers = req.headers.cookie;
	const token = getCookie({ name: "jwt", headers: headers });
	if (token === undefined || token === null || token === "") {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const payload = jwt.verify(token, JWT_SECRET);
	console.log(payload);
	res.status(200).json(payload);
});

//Route to get list of users based on placement query param
router.get("/:placement", isLoggedIn, async (req, res) => {
	let placement = req.params.placement;
	const users = await Users.find({ placement: placement }).select(
		"fullname username email placement totalHours"
	);
	res.json(users);
});

router.delete("/:username", async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		await user.remove();
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server Error" });
	}
});

module.exports = router;
