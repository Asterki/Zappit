// * This file is used for the API route
// * /api/private/accounts/

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodeMailer = require('nodemailer');
const fs = require('fs');

const router = express.Router();
router.use(cors());

router.post(
	'/login',
	[
		rateLimit({
			windowMs: 15 * 60 * 1000,
			max: 3,
		}),
	],
	(req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) return next(err);

			if (!user) return res.status(200).send({ success: false, message: info.message });
			return res.status(200).send({ success: true, message: 'ok' });
		})(req, res, next);
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
