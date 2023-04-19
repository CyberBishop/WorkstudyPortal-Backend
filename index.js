const express = require("express");
const mongoose = require("mongoose");
const attendanceRoutes = require("./routes/attendacnceRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "https://workstudy.cu.edu.ng");
	res.header("Access-Control-Allow-Credentials", true);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
});

app.use("/attendances", attendanceRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

//Routes go here
app.all("*", (req, res) => {
	res.json({ status: "server is running" });
});

//Connect to the database before listening
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log("listening for requests");
	});
});
