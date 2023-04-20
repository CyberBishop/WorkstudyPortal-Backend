const Attendance = require("../models/attendanceModels");
const User = require("../models/userModels");
const moment = require("moment");
const verifyToken = require("../utils/verifyToken");

const createAttendance = async (req, res) => {
	const { matricNumber } = req.body;
	const signInTime = new Date();

	// Check if there is an existing attendance record for the student with today's date and no signOutTime
	const today = moment().format("YYYY-MM-DD");
	const existingAttendance = await Attendance.findOne({
		matricNumber,
		date: today,
		signOutTime: { $eq: null },
	});
	if (existingAttendance) {
		return res.status(200).json({ error: "You are already signed in" });
	}

	// Create a new attendance record for the student
	const attendance = new Attendance({
		matricNumber,
		date: moment().format("YYYY-MM-DD"),
		signInTime,
	});
	await attendance.save();
	res.send(attendance);
};

const updateAttendance = async (req, res) => {
	const { matricNumber } = req.body;
	const signOutTime = new Date();

	try {
		const lastAttendance = await Attendance.findOne({ matricNumber })
			.sort({ signInTime: -1 })
			.limit(1);

		if (!lastAttendance || lastAttendance.signOutTime) {
			return res
				.status(200)
				.send({ message: "User not found or already signed out" });
		}

		const totalTime =
			(signOutTime.getTime() - lastAttendance.signInTime.getTime()) /
			(1000 * 60 * 60);

		lastAttendance.totalTime = totalTime;
		lastAttendance.signOutTime = signOutTime;
		await lastAttendance.save();

		// Update total hours in User model
		const user = await User.findOne({
			username: lastAttendance.matricNumber,
		});

		const totalHours = (Number(user.totalHours) || 0) + Number(totalTime);
		user.totalHours = totalHours;
		await user.save();

		res.send(lastAttendance);
	} catch (err) {
		console.log(err);
		res.send(err);
	}
};

const getAttendance = async (req, res) => {
	// Get the user's role from jwt
	const token = await verifyToken(req.headers.cookie);
	let role = token.role;
	let username = token.username;

	// If the user is a student, get the student's attendance records
	if (role === "student") {
		const attendance = await Attendance.find({
			matricNumber: username,
		});
		res.send(attendance);
	} else {
		// If the user is an admin, get all attendance records
		const attendance = await Attendance.find();
		res.send(attendance);
	}
};

module.exports = {
	createAttendance,
	updateAttendance,
	getAttendance,
};
