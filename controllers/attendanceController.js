const User = require('../models/userModels');
const Attendance = require('../models/attendanceModels');
const moment = require('moment');
const verifyToken = require('../utils/verifyToken');

const handleServerError = (error, res) => {
    console.error(error);
    return res.json({ error: 'An error occurred' });
};

exports.createAttendance = async (req, res) => {
    const { matricNumber } = req.body;
    const { username } = req.user;

    if (matricNumber !== username) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    const signInTime = new Date();
    const today = moment().format('YYYY-MM-DD');

    try {
        const existingAttendance = await Attendance.findOne({
            matricNumber,
            date: today,
            signOutTime: { $eq: null },
        });

        if (existingAttendance) {
            return res.status(200).json({ error: 'User already signed in' });
        }

        const attendance = new Attendance({
            matricNumber,
            date: today,
            signInTime,
        });

        await attendance.save();
        res.send(attendance);
    } catch (error) {
        return handleServerError(error);
    }
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
            return res.status(200).send({
                message: 'User not found or already signed out',
            });
        }

        const totalTime =
            (signOutTime - lastAttendance.signInTime) / (1000 * 60 * 60);

        lastAttendance.totalTime = totalTime;
        lastAttendance.signOutTime = signOutTime;
        await lastAttendance.save();

        const user = await User.findOne({
            username: lastAttendance.matricNumber,
        });

        if (user) {
            const totalHours = (Number(user.totalHours) || 0) + totalTime;
            user.totalHours = totalHours;
            await user.save();
        }

        res.send(lastAttendance);
    } catch (error) {
        return handleServerError(error);
    }
};

exports.getAttendance = async (req, res) => {
    const { username, role } = req.user;

    try {
        const attendance =
            role === 'student'
                ? await Attendance.find({ matricNumber: username })
                : await Attendance.find();

        res.send(attendance);
    } catch (error) {
        return handleServerError(error);
    }
};
