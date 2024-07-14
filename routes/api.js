const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const router = express.Router();

let users = [];

/* GET users listing. */
router.get('/user/list', function(req, res, next) {
    res.json(users);
});

router.post('/user/login', async function(req, res, next) {
    const { username, password} = req.body;

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({message: 'Invalid username or password'});
    }

    const validPwd = await bcrypt.compare(password, user.password);
    if (!validPwd) {
        return res.status(400).json({message: 'Invalid username or password'});
    }

    req.session.userId = user.id;
    res.status(200).json({message: 'Login successful'});
});

router.post('/user/register', async function(req, res, next) {
    console.log("Register route");

    const {username, password} = req.body;

    if (users.some(user => user.username === username)) {
        return res.status(400).json({message: 'User already exist'});
    }

    try {
        const hashedPwd = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            username: username,
            password: hashedPwd
        };

        users.push(newUser)
        res.status(200).json(newUser);
    }
    catch {
        res.status(400);
    }
});

module.exports = router;
