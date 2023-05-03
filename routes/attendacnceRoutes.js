const express = require('express');
const router = express.Router();
const {
    createAttendance,
    updateAttendance,
    getAttendance,
    getAttendances,
} = require('../controllers/attendanceController');
const { isLoggedIn } = require('../middlewares/auth'); // import isLoggedIn custom middleware
const verifyToken = require('../utils/verifyToken');

router.use(express.json());

router.post('/attendance', createAttendance);

router.put('/attendance', updateAttendance);

router.get('/attendance', isLoggedIn, getAttendance);

router.get('/attendances', isLoggedIn, getAttendances);

module.exports = router;
