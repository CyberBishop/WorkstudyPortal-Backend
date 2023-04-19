require("dotenv").config();
const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

let deleteUser = async (username) => {
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return { message: "User not found" };
		}
		await user.remove();
		return { message: "User deleted successfully" };
	} catch (error) {
		return { message: "Server Error" };
	}
};

let getUser = async (uuid) => {
	let user;
	if (uuid) {
		user = await User.find({ uuid: uuid }).select(
			"fullname username email placement course level totalHours"
		);
	} else {
		user = await User.find({}).select(
			"fullname username email placement course level totalHours"
		);
	}
	return user;
};

let getUsersByPlacement = async (placement) => {
	try {
		const users = await User.find({ placement: placement }).select(
			"fullname username email placement totalHours"
		);
		console.log(users);
		return users;
	} catch (error) {
		return { error: "An error occured" };
	}
};

let createUser = async (userData) => {
	try {
		const { email } = userData;
		const checkEmail = await User.find({ email }).select("email");
		if (checkEmail.length > 0) {
			return { error: "email / matric_number exists" };
		}
		const user = await User.create(userData);
		return user;
	} catch (error) {
		return { error: "An Error Occured" };
	}
};

let userLogin = async (username, password) => {
	try {
		const user = await User.findOne({ username: username });
		if (user) {
			const valid = await bcrypt.compare(password, user.password);
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

				let role = user.role;
				return { token, role };
			} else {
				return { error: "Invalid Username/Password" };
			}
		} else {
			return { error: "Invalid Username/Password" };
		}
	} catch (error) {
		return { error: "An Error Occured" };
	}
};

module.exports = {
	deleteUser,
	getUser,
	getUsersByPlacement,
	createUser,
	userLogin,
};
