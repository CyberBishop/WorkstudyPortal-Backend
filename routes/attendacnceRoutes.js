const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { isLoggedIn } = require('../middlewares/auth');

router.post('/attendance', isLoggedIn, attendanceController.createAttendance);
router.put('/attendance', isLoggedIn, attendanceController.updateAttendance);
router.get('/attendance', isLoggedIn, attendanceController.getAttendance);

module.exports = router;
