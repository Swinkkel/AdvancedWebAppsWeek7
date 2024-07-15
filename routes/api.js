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

router.get('/secret', checkAuthenticated, function(req, res, next) {
    res.status(200).json({message: 'Authenticated'});
});

router.post('/user/login', checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ message: 'Login successful' });
        });
    })(req, res, next);
});

router.post('/user/register', checkNotAuthenticated, async (req, res, next) => {
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

let todos = [];

router.post('/todos', checkAuthenticated, (req, res, next) => {


});

router.get('/todos/list', checkAuthenticated, (req, res, next) => {

});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.status(401).json({message: 'Authentication failed'});
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/")
        
    }

    return next()
}

module.exports = {router, users};
