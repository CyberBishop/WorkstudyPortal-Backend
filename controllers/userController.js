require("dotenv").config();
const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const deleteUserByUsername = async (username) => {
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return { message: "User not found" };
		}
		await user.remove();
		return { message: "User deleted successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Server Error" };
	}
};

const getUser = async (uuid) => {
	try {
		const selectFields =
			"fullname username email placement course level totalHours";
		const users = uuid
			? await User.find({ uuid }).select(selectFields)
			: await User.find({}).select(selectFields);
		return users;
	} catch (error) {
		console.error(error);
		return { error: "An error occurred" };
	}
};

const getUsersByPlacement = async (placement) => {
	try {
		const selectFields = "fullname username email placement totalHours";
		const users = await User.find({ placement }).select(selectFields);
		return users;
	} catch (error) {
		console.error(error);
		return { error: "An error occurred" };
	}
};

const createUser = async (userData) => {
	try {
		const { email } = userData;
		const checkEmail = await User.find({ email }).select("email");
		if (checkEmail.length > 0) {
			return { error: "Email / matric_number exists" };
		}
		const user = await User.create(userData);
		return user;
	} catch (error) {
		console.error(error);
		return { error: "An error occurred" };
	}
};

const userLogin = async (username, password) => {
	try {
		const user = await User.findOne({ username });
		if (user) {
			const valid = await bcrypt.compare(password, user.password);
			if (valid) {
				const { uuid, role, email, firstName, lastName } = user;
				const token = jwt.sign(
					{ uuid, username, email, role, firstName, lastName },
					JWT_SECRET
				);
				return { token, role };
			}
		}
		return { error: "Invalid Username/Password" };
	} catch (error) {
		console.error(error);
		return { error: "An error occurred" };
	}
};

const updateUserPassword = async (uuid, password) => {
	try {
		const user = await User.findOne({ uuid });
		if (!user) {
			return { message: "User not found" };
		}
		user.password = password;
		await user.save();
		return { message: "Password updated successfully" };
	} catch (error) {
		console.error(error);
		return { message: "Password not updated" };
	}
};

module.exports = {
	deleteUserByUsername,
	getUser,
	getUsersByPlacement,
	createUser,
	userLogin,
	updateUserPassword,
};
