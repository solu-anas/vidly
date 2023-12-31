const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const usersRouter = express.Router();
const { User, validate, generateAuthToken } = require('../models/user');
const auth = require('../middleware/auth');

// Getting the current user
usersRouter.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

// Getting the list of all users after auth is successful
usersRouter.get('/all', auth, async (req, res) => {
    const users = await User.find().select('-password').sort('name');
    res.send(users);
});

// Register a new user
usersRouter.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = usersRouter;