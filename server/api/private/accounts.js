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

const { accountsTransporter } = require('../../config/nodemailer');
const User = require('../../models/user');

const router = express.Router();
router.use(cors());

router.post(
	'/login',
	[
		rateLimit({
			windowMs: ms('1h'),
			max: 3,
			statusCode: 200,
			message: {
				success: false,
				message: 'err-rate-limit',
			},
		}),
	],
	(req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) return next(err);
			if (!user) return res.status(200).send({ success: false, message: info.message });

			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}
				return res.status(200).send({ success: true, message: 'ok' });
			});
		})(req, res, next);
	}
);

router.get(
	'/logout',
	[
		rateLimit({
			windowMs: ms('10s'),
			max: 5,
			statusCode: 200,
			message: {
				success: false,
				message: 'err-rate-limit',
			},
		}),
	],
	(req, res) => {
		req.logout();
		res.redirect('/');
	}
);

router.post(
	'/register',
	[
		rateLimit({
			windowMs: ms('1d'),
			max: 1,
			statusCode: 200,
			message: {
				success: false,
				message: 'err-rate-limit',
			},
		}),
	],
	(req, res) => {
		let { username, email, password, lang } = req.body;
		if (!username || !email || !password || !lang) return res.status(200).send({ success: false, message: 'err-missing-fields' });

		if (username.length > 24 || username.length < 3) return res.status(200).send({ success: false, message: 'err-username-length' });
		if (!validator.isEmail(email)) return res.status(200).send({ success: false, message: 'err-email-invalid' });
		if (password.length < 8 || password.length > 128) return res.status(200).send({ success: false, message: 'err-password-length' });

		User.findOne({ $or: [{ 'email.value': email }, { username: username }] }, (err, result) => {
			if (err) return res.send(200).send({ success: false, message: 'err-internal-error' });
			if (result) return res.status(200).send({ success: false, message: 'err-credentials-used' });

			// let zoneInfo = geoip.lookup(ip); // ! Disabled for development
			let user = new User({
				username: username,
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

			user.save((err, result) => {
				if (err || !result) return res.send(200).send({ success: false, message: 'err-internal-error' });
				return res.status(200).send({ success: true, message: 'ok' });
			});
		});
	}
);

module.exports = router;
