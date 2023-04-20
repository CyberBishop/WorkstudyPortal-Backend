const express = require("express");
const router = express.Router();
const {
	createAttendance,
	updateAttendance,
	getAttendance,
} = require("../controllers/attendanceController");
const { isLoggedIn } = require("../middlewares/auth"); // import isLoggedIn custom middleware
const verifyToken = require("../utils/verifyToken");

router.use(express.json());

router.post("/", createAttendance);

router.put("/", updateAttendance);

router.get("/", isLoggedIn, getAttendance);

module.exports = router;
