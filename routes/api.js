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
        console.log(users)

        res.status(201).json(newUser);
    }
    catch {
        res.status(400);
    }
});

module.exports = router;
