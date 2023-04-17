const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
	matricNumber: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	signInTime: {
		type: Date,
		required: true,
	},
	signOutTime: {
		type: Date,
		required: false,
		default: null,
	},
	totalTime: {
		type: Number,
		required: false,
	},
});

module.exports = mongoose.model("Attendance", attendanceSchema);
