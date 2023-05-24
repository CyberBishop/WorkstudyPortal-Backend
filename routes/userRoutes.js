const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.post('/login', userController.userLogin);
router.put('/user/:username', isAdmin, userController.updateUser);
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
