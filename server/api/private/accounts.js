// * This file is used for the API route
// * /api/private/accounts/

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const validator = require('validator');
const geoip = require('geoip-lite');
const uuid = require('uuid');
const ms = require('ms');
const fs = require('fs');

const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Users = require('../../models/users');
const { redisClient } = require('../../config/databases');

const router = express.Router();
router.use(
	cors({
		origin: process.env.HOST,
		optionsSuccessStatus: 200,
	})
);

router.post(
	'/login',
	rateLimit({
		windowMs: ms('1h'),
		max: 5,
		message: {
			success: false,
			message: 'err-rate-limit',
		},
	}),
	(req, res, next) => {
		// Authenticate the user
		passport.authenticate('local', (err, user, info) => {
			// If there was an error in the authentication process
			if (err) return next(err);
			if (!user) return res.status(200).send({ success: false, message: info.message });

			// Login the user
			req.logIn(user, (err) => {
				if (err) throw err;
				return res.status(200).send({ success: true, message: 'ok' });
			});
		})(req, res, next);
	}
);

router.post(
	'/logout',
	rateLimit({
		windowMs: ms('6h'),
		max: 30,
		message: {
			success: false,
			message: 'err-rate-limit',
		},
	}),
	(req, res, next) => {
		// If the user is not logged in
		if (!req.user) return res.status(200).send({ success: false, message: 'err-not-logged-in' });

		// Logout the user and redirect to the welcome page
		req.logout();
		res.redirect('/');
	}
);

router.post(
	'/register',
	rateLimit({
		windowMs: ms('1d'),
		max: 1,
		message: {
			success: false,
			message: 'err-rate-limit',
		},
	}),
	(req, res, next) => {
		// Check if the body parameters are provided
		let { username, email, password } = req.body;
		if (!username || !email || !password) return res.status(200).send({ success: false, message: 'err-missing-fields' });

		// Check if the body parameters are valid
		if (username.length > 24 || username.length < 3) return res.status(200).send({ success: false, message: 'err-username-length' });
		if (!validator.isEmail(email)) return res.status(200).send({ success: false, message: 'err-email-invalid' });
		if (password.length < 8 || password.length > 128) return res.status(200).send({ success: false, message: 'err-password-length' });

		User.findOne({ $or: [{ 'email.value': email }, { username: username.toLowerCase() }] }, (err, result) => {
			// Return if error, check if the username or email are already taken
			if (err) return res.send(200).send({ success: false, message: 'err-internal-error' });
			if (result) return res.status(200).send({ success: false, message: 'err-credentials-used' });

			// Create the user with the data provided
			// let zoneInfo = geoip.lookup(ip); // ! Disabled for development
			let user = new User({
				username: username.toLowerCase(),
				email: {
					value: email,
					verified: false,
				},
				password: bcrypt.hashSync(password, 10),
				userID: uuid.v4(),
				// accountInfo: {
				//     authorizedLoginZones: [{ country: zoneInfo.country, city: zoneInfo.city }],
				// },
			});

			// Save the user
			user.save((err, result) => {
				if (err || !result) return res.send(200).send({ success: false, message: 'err-internal-error' });
				return res.status(200).send({ success: true, message: 'ok' });
			});
		});
	}
);

router.post(
	'/verifyEmail',
	rateLimit({
		windowMs: ms('1h'),
		max: 5,
		message: {
			success: false,
			message: 'err-rate-limit',
		},
	}),
	async (req, res) => {
		let { token } = req.query;
		if (!req.token) res.redirect('/');

		// Get the tokens from the database and parse them
		let emailVerificationTokens = JSON.parse(await redisClient.get('emailVerificationTokens'));
		if (emailVerificationTokens == null) return res.redirect('/');

		// Find the token provided by the user in the database, return if not found
		let emailVerificationToken = emailVerificationTokens.find((element) => element.token == token);
		if (!emailVerificationToken) return res.redirect('/');

		// Update the email value
		Users.updateOne(
			{ email: { value: emailVerificationToken.email } },
			{ $set: { 'email.verified': true } },
			(err, result) => {
				if (err) return res.redirect('/');
				res.redirect('/');
			}
		)
	}
);

module.exports = router;
