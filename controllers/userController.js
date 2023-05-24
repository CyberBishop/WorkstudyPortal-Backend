const User = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const verifyToken = require('../utils/verifyToken');

const handleServerError = (error) => {
    console.error(error);
    return res.json({ error: 'An error occurred' });
};

exports.deleteUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return { message: 'User not found' };
        }
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        return handleServerError(error);
    }
};

exports.verifyUserToken = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const payload = await verifyToken(token);
    return res.json(payload);
};

exports.getUser = async (req, res) => {
    const { uuid, role } = req.user;
    try {
        const selectFields =
            'fullname username email placement course level totalHours';
        const user = await User.find({ uuid }).select(selectFields);
        return res.json(user);
    } catch (error) {
        return handleServerError(error);
    }
};

exports.getUsers = async (req, res) => {
    const { uuid, role } = req.user;
    try {
        const selectFields =
            'fullname username email placement course level totalHours';
        const users = await User.find({}).select(selectFields);
        return res.json(users);
    } catch (error) {
        return handleServerError(error);
    }
};

exports.getUsersByPlacement = async (req, res) => {
    const { placement } = req.params;
    try {
        const selectFields = 'fullname username email placement totalHours';
        const users = await User.find({ placement }).select(selectFields);
        return res.json(users);
    } catch (error) {
        return handleServerError(error);
    }
};

exports.createUser = async (req, res) => {
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
    }

    try {
        const checkEmail = await User.findOne({ email }).select('email');
        if (checkEmail) {
            return res.json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
            email,
            fullname,
            placement,
            course,
            level,
        });
        return res.json({ message: 'User created' });
    } catch (error) {
        return handleServerError(error);
    }
};

exports.userLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            const valid = await bcrypt.compare(password, user.password);
            if (valid) {
                const { uuid, role, email, firstName, lastName } = user;
                const token = jwt.sign(
                    { uuid, username, email, role, firstName, lastName },
                    JWT_SECRET
                );
                return res.json({ token, role });
            }
        }
        return res.json({ error: 'Invalid Username/Password' });
    } catch (error) {
        return handleServerError(error);
    }
};

exports.updateUserPassword = async (req, res) => {
    const { uuid } = req.user;
    const { password } = req.body;

    if (!password) {
        return res.json({ error: 'New Password is required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
            { uuid },
            { password: hashedPassword }
        );
        if (!user) {
            return res.json({ message: 'User not found' });
        }
        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        return handleServerError(error);
    }
};

exports.updateUser = async (req, res) => {
    const { username } = req.params;
    const { fullname, email, placement, course, level } = req.body;

    if (!fullname || !email || !placement || !course || !level) {
        return res.json({ error: 'Missing required fields' });
    }

    try {
        const user = await User.findOneAndUpdate(
            { username },
            { fullname, email, placement, course, level }
        );

        if (!user) {
            return res.json({ message: 'User not found' });
        }
        return res.json({ message: 'User updated successfully' });
    } catch (error) {
        return handleServerError(error);
    }
};
