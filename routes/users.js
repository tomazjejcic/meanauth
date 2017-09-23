const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    })

    User.addUser(newUser, (err, user) => {
        if(err) {
            res.json({success: false, message: 'Failed to register user'})
        } else {
            res.json({success: true, message: 'User registered'})
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'User not found'})
        }

        // if username exists check if passwords match
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    succes: true,
                    token: 'JWT ' + token,
                    //build user, you don't want to pass the returned one, because it has the password
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: 'Wrong password'})
            }
        })
    })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => { // second parameter (passport.aut...) protects the route
    res.json({user: req.user })
});

// Validate
// router.get('/validate', (req, res, next) => {
//     res.send('VALIDATE');
// });

module.exports = router;