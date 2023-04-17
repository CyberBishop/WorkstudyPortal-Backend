require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const verifyToken = require("../utils/verifyToken");
const { isLoggedIn } = require("../middlewares/auth"); // import isLoggedIn custom middleware
const {
	deleteUser,
	getUser,
	getUsersByPlacement,
	createUser,
	userLogin,
} = require("../controllers/users");
const bcrypt = require("bcryptjs");

//Login Route, verify user and get user token
router.post("/login", async (req, res) => {
	const login = await userLogin(req.body.username, req.body.password);
	res.send(login);
});

//Signup Route
router.post("/register", async (req, res) => {
	req.body.password = await bcrypt.hash(req.body.password, 10);
	const uniqueRandomID = uuid.v4();
	req.body.uuid = uniqueRandomID;

	let user = await createUser(req.body);
	res.send(user);
});

//Route to verify jwt
router.get("/verify", async (req, res) => {
	const headers = req.headers.cookie;
	const token = await verifyToken(headers);
	res.send(token);
});

//Route to verify jwt
router.get("/me", isLoggedIn, async (req, res) => {
	const { username } = req.user;
	let message = await getUser(username);
	res.send(message);
});

//Route to get list of users based on placement query param
router.get("/:placement", isLoggedIn, async (req, res) => {
	let placement = req.params.placement;
	const users = await getUsersByPlacement(placement);
	res.send(users);
});

//Route to get users data
router.get("/", isLoggedIn, async (req, res) => {
	const users = await getUser();
	res.send(users);
});

router.delete("/:username", async (req, res) => {
	const { username } = req.params;
	let message = deleteUser(username);
	res.send(message);
});

module.exports = router;
