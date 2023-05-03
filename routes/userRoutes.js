require('dotenv').config();
const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = process.env;
const verifyToken = require('../utils/verifyToken');
const { isLoggedIn } = require('../middlewares/auth'); // import isLoggedIn custom middleware
const {
    deleteUser,
    getUser,
    getUsersByPlacement,
    createUser,
    userLogin,
    updateUserPassword,
    updateUser,
} = require('../controllers/userController');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const login = await userLogin(username, password);
    res.json({ login });
});

// route to update user data
router.put('/user/:username', async (req, res) => {
    const { username } = req.params;
    const { fullname, email, placement, course, level } = req.body;
    try {
        const result = await updateUser(username, {
            fullname: fullname,
            email: email,
            placement: placement,
            course: course,
            level: level,
        });
        res.json({ message: 'user updated' });
    } catch (error) {
        console.log(error);
        res.json({ error: 'An error occured' });
    }
});

router.post('/user/register', async (req, res) => {
    const { username, password, email, fullname, placement, course, level } =
        req.body;

    if (
        !username ||
        !password ||
        !email ||
        !fullname ||
        !placement ||
        !course ||
        !level
    ) {
        return res.json({ error: 'Please fill in all fields' });
    } else {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const uniqueRandomID = uuid.v4();
        req.body.uuid = uniqueRandomID;

        try {
            let user = await createUser(req.body);
            res.json({ message: 'user created' });
        } catch (error) {
            res.json({ error: 'An error occurred' });
        }
    }
});

router.get('/user/verify', async (req, res) => {
    const cookie = req.headers.authorization.split(' ')[1];
    const token = await verifyToken(cookie);
    res.send(token);
});

router.get('/user', isLoggedIn, async (req, res) => {
    const { uuid, role } = req.user;
    const users = await getUser(uuid);
    res.send(users);
});

router.get('/users', isLoggedIn, async (req, res) => {
    const { uuid, role } = req.user;

    if (role === 'admin') {
        users = await getUser();
        res.send(users);
    } else {
        res.json({ error: 'user not authorized' });
    }
});

router.get('/:placement', isLoggedIn, async (req, res) => {
    const { placement } = req.params;
    const users = await getUsersByPlacement(placement);
    res.send(users);
});

router.post('/user/reset-password', isLoggedIn, async (req, res) => {
    const { uuid } = req.user;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await updateUserPassword(uuid, hashedPassword);
    res.send(result);
});

router.delete('/:username', async (req, res) => {
    const { username } = req.params;
    const message = await deleteUser(username);
    res.send(message);
});

module.exports = router;
