//models
const User = require('../models/userModels');
const Attendance = require('../models/attendanceModels');

const moment = require('moment');

//utils
const verifyToken = require('../utils/verifyToken');

exports.createAttendance = async (req, res) => {
    const { matricNumber } = req.body;
    const signInTime = new Date();

    // Check if there is an existing attendance record for the student with today's date and no signOutTime
    const today = moment().format('YYYY-MM-DD');
    const existingAttendance = await Attendance.findOne({
        matricNumber,
        date: today,
        signOutTime: { $eq: null },
    });
    if (existingAttendance) {
        return res.status(200).json({ error: 'You are already signed in' });
    }

    // Create a new attendance record for the student
    const attendance = new Attendance({
        matricNumber,
        date: moment().format('YYYY-MM-DD'),
        signInTime,
    });
    await attendance.save();
    res.send(attendance);
};

exports.updateAttendance = async (req, res) => {
    const { matricNumber } = req.body;
    const { username } = req.user;

    if (matricNumber !== username) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    const signOutTime = new Date();

    try {
        const lastAttendance = await Attendance.findOne({ matricNumber })
            .sort({ signInTime: -1 })
            .limit(1);

        if (!lastAttendance || lastAttendance.signOutTime) {
            return res
                .status(200)
                .send({ message: 'User not found or already signed out' });
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

exports.getAttendance = async (req, res) => {
    const { username, role } = req.user;

    // If the user is a student, get the student's attendance records
    if (role === 'student') {
        const attendance = await Attendance.find({
            matricNumber: username,
        });
        return res.send(attendance);
    } else {
        // If the user is an admin, get all attendance records
        const attendance = await Attendance.find();
        return res.send(attendance);
    }
};
