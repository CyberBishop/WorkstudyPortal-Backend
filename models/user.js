const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	uuid: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	fullname: {
		type: String,
		required: true,
		trim: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	accountDetails: {
		type: Object,
		required: false,
		default: null,
	},
	totalHours: {
		type: Number,
		required: false,
	},
	placement: {
		type: String,
		required: false,
	},
	course: {
		type: String,
		required: true,
	},
	level: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
		trim: true,
		default: "student",
	},
});

module.exports = mongoose.model("User", userSchema);
