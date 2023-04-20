require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = process.env;
const verifyToken = require("../utils/verifyToken");
const { isLoggedIn } = require("../middlewares/auth"); // import isLoggedIn custom middleware
const {
	deleteUser,
	getUser,
	getUsersByPlacement,
	createUser,
	userLogin,
	updateUserPassword,
} = require("../controllers/userController");

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const login = await userLogin(username, password);
	res.json({ login });
});

router.post("/register", async (req, res) => {
	const { username, password, email, fullname, placement, course, level } =
		req.body;

	if (
		!username ||
		!password ||
		!email ||
		!fullname ||
		!placement ||
		!course ||
		!level
	) {
		return res.status(400).json({ error: "Please fill in all fields" });
	}

	req.body.password = await bcrypt.hash(req.body.password, 10);
	const uniqueRandomID = uuid.v4();
	req.body.uuid = uniqueRandomID;

	let user = await createUser(req.body);
	res.send(user);
});

router.get("/verify", async (req, res) => {
	const cookie = req.headers.authorization.split(" ")[1];
	const token = await verifyToken(cookie);
	res.send(token);
});

router.get("/", isLoggedIn, async (req, res) => {
	const { uuid, role } = req.user;
	let users;
	if (role === "admin" || role === "student") {
		users = await getUser(uuid);
	}
	res.send(users);
});

router.get("/:placement", isLoggedIn, async (req, res) => {
	const { placement } = req.params;
	const users = await getUsersByPlacement(placement);
	res.send(users);
});

router.post("/reset-password", isLoggedIn, async (req, res) => {
	const { uuid } = req.user;
	const { password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	const result = await updateUserPassword(uuid, hashedPassword);
	res.send(result);
});

router.delete("/:username", async (req, res) => {
	const { username } = req.params;
	const message = await deleteUser(username);
	res.send(message);
});

module.exports = router;
