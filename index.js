const express = require("express");
const mongoose = require("mongoose");
const attendanceRoutes = require("./routes/attendacnce");
const userRoutes = require("./routes/user");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
	})
);
app.use("/attendance", attendanceRoutes);
app.use("/user", userRoutes);

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
	res.json({ "every thing": "is awesome" });
});

//Connect to the database before listening
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log("listening for requests");
	});
});
