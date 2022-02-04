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

const User = require('../../models/users');
const { levelDB } = require('../../config/databases');

const cors = require('cors');
const rateLimit = require('express-rate-limit');
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
		statusCode: 200,
		message: {
			message: 'err-rate-limit',
			code: 429,
		},
	}),
	(req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) return res.send({ message: 'err-server-error', code: 500 });
			if (!user) return res.send({ message: info.message, code: 403 });

			req.logIn(user, (err) => {
				if (err) throw err;
				return res.status(200).send({ message: 'ok', code: 200 });
			});
		})(req, res, next);
	}
);

router.post(
	'/register',
	rateLimit({
		windowMs: ms('1d'),
		max: 1,
		statusCode: 200,
		message: {
			message: 'err-rate-limit',
			code: 429,
		},
	}),
	(req, res, next) => {
		let { username, email, password } = req.body;
		if (!username || !email || !password) return res.send({ message: 'err-missing-body-params', code: 400 });

		if (username.length > 24 || username.length < 3) return res.send({ message: 'err-username-length', code: 400 });
		if (!validator.isEmail(email)) return res.send({ message: 'err-invalid-email', code: 400 });
		if (password.length < 8 || password.length > 128) return res.send({ message: 'err-password-length', code: 400 });

		User.findOne({ $or: [{ 'email.value': email }, { username: username.toLowerCase() }] }, (err, result) => {
			if (err) return res.send({ message: 'err-server-error', code: 500 });
			if (result) return res.send({ message: 'err-username-taken', code: 400 });

			let user = new User({
				username: username.toLowerCase(),
				email: {
					value: email,
					verified: false,
				},
				password: bcrypt.hashSync(password, 10),
				userID: uuid.v4(),
			});

			user.save((err, result) => {
				if (err || !result) return res.send({ message: 'err-server-error', code: 500 });

				req.logIn(result, (err) => {
					if (err) return res.send({ message: 'err-server-error', code: 500 });
				});

				return res.status(200).send({ code: 200, message: 'ok' });
			});
		});
	}
);

router.post(
	'/verify-email',
	rateLimit({
		windowMs: ms('1h'),
		max: 5,
		statusCode: 200,
		message: {
			code: 429,
			message: 'err-rate-limit',
		},
	}),
	(req, res) => {
		let { code } = req.body;
		if (!code) return res.send({ message: 'err-missing-body-params', code: 400 });
		if (code.length !== 6) return res.send({ message: 'err-invalid-code', code: 400 });

		levelDB.get('email-accounts-verification-codes', (err, result) => {
			if (err) return res.send({ message: 'err-server-error', code: 500 });

			let codes = JSON.parse(result);
			let found = codes.find((element) => element.code == code);

			if (!found) return res.send({ message: 'err-invalid-code', code: 400 });
			if (found.expires < Date.now()) return res.send({ message: 'err-code-expired', code: 400 });

			codes = codes.filter((code) => code.code !== found.code);

			levelDB.put('email-accounts-verification-codes', JSON.stringify(codes), (err) => {
				if (err) return res.send({ message: 'err-server-error', code: 500 });

				User.findOneAndUpdate({ 'email.value': found.email }, { $set: { 'email.verified': true } }, (err, result) => {
					if (err || !result) return res.send({ message: 'err-server-error', code: 500 });
					return res.send({ message: 'ok', code: 200 });
				});
			});
		});
	}
);

router.get(
	'/logout',
	rateLimit({
		windowMs: ms('6h'),
		max: 30,
		statusCode: 200,
		message: {
			message: 'err-rate-limit',
			code: 429,
		},
	}),
	(req, res, next) => {
		if (!req.user) return res.send({ message: 'err-not-logged-in', code: 403 });

		req.logout();
		res.redirect('/');
	}
);

module.exports = router;
