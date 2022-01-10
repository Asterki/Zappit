// * This file is used for the API route
// * /api/private/accounts/login

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodeMailer = require('nodemailer');
const passportLocal = require('passport-local');

const router = express.Router();
router.use(cors());

const strategy = new passportLocal.Strategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
    },
    (email, password, done) => {
        const user = {
            email: '',
            password: '',
        };
        if (email === user.email && bcrypt.compareSync(password, user.password)) {
            return done(null, user);
        }
        return done(null, false);
    },
);


router.get('/login', (req, res) => {

});

module.exports = router;
