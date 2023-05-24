require('dotenv').config();
const express = require('express');
const router = express.Router();

const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const { JWT_SECRET } = process.env;
const { isLoggedIn, isAdmin } = require('../middlewares/auth'); // import isLoggedIn custom middleware
const userController = require('../controllers/userController');

// Login route
router.post('/login', userController.userLogin);

// route to update user data
router.put('/user/:username', isAdmin, userController.updateUser);

// account creation route
router.post('/user/register', userController.createUser);

router.get('/user/verify', userController.verifyUserToken);

router.get('/user', isLoggedIn, userController.getUser);

router.get('/users', isLoggedIn, userController.getUsers);

router.get('/users/:placement', isLoggedIn, userController.getUsersByPlacement);

router.post(
    '/user/resetPassword',
    isLoggedIn,
    userController.updateUserPassword
);

router.delete('/:username', isAdmin, userController.deleteUserByUsername);

module.exports = router;
