const express = require('express');
const router = express.Router();

const attendanceController = require('../controllers/attendanceController');

const { isLoggedIn, isAdmin } = require('../middlewares/auth'); // import isLoggedIn custom middleware

const verifyToken = require('../utils/verifyToken');

router.use(express.json());

router.post('/attendance', isLoggedIn, attendanceController.createAttendance);

router.put('/attendance', isLoggedIn, attendanceController.updateAttendance);

router.get('/attendance', isLoggedIn, attendanceController.getAttendance);

module.exports = router;
