// * This file is used for the API route
// * /api/private/checks/

const express = require('express');
const ms = require('ms');
const level = require('level');

const { cache } = require('../../config/databases');
const Users = require('../../models/users');

const rateLimit = require('express-rate-limit');
const cors = require('cors');
const router = express.Router();

router.use(
	cors({
		origin: process.env.HOST,
		optionsSuccessStatus: 200,
	})
);
router.use(
	rateLimit({
		windowMs: ms('10s'),
		max: 5,
		statusCode: 200,
		message: {
			code: 429,
			message: 'err-rate-limit',
		},
	})
);

router.post('/accounts/is-email-taken', (req, res) => {
	const { email } = req.body;
	if (!email) res.send({ message: 'err-missing-body-params', code: 400 });

	cache.get('checks-accounts-is-email-taken', (err, value) => {
		let findOnDB = () => {
			Users.find({ 'email.value': new RegExp('^' + email.substring(0, 4)) }, (err, docs) => {
				if (err) return res.send({ code: 500, error: 'err-server-error' });

				let emails = [];
				docs.forEach((doc) => emails.push(doc.email.value));

				let parsedValue = JSON.parse(value);
				emails.forEach((email) => parsedValue.push(email));

				cache.put('checks-accounts-is-email-taken', JSON.stringify(parsedValue), (err) => {
					if (err) return res.send({ message: 'err-server-error', code: 500 });
				});

				return res.send({ result: parsedValue.includes(email) });
			});
		};

		if (err instanceof level.errors.NotFoundError) return findOnDB();
		if (!err instanceof level.errors.NotFoundError) return res.send({ message: 'err-server-error', code: 500 });

		value = JSON.parse(JSON.stringify(value));

		if (value.includes(email)) return res.send({ message: true, code: 200 });
		return findOnDB();
	});
});

router.post('/accounts/is-username-taken', (req, res) => {
	const { username } = req.body;
	if (!username) res.send({ message: 'err-missing-body-params', code: 400 });

	cache.get('checks-accounts-is-username-taken', (err, value) => {
		let findOnDB = () => {
			Users.find({ username: new RegExp('^' + username.substring(0, 4)) }, (err, docs) => {
				if (err) return res.send({ code: 500, error: 'err-server-error' });

				let usernames = [];
				docs.forEach((doc) => usernames.push(doc.username));

				let parsedValue = JSON.parse(value);
				usernames.forEach((username) => parsedValue.push(username));

				cache.put('checks-accounts-is-username-taken', JSON.stringify(parsedValue), (err) => {
					if (err) return res.send({ message: 'err-server-error', code: 500 });
					return res.send({ result: parsedValue.includes(username) });
				});
			});
		};

		if (err instanceof level.errors.NotFoundError) return findOnDB();
		if (!err instanceof level.errors.NotFoundError) return res.send({ message: 'err-server-error', code: 500 });
		value = JSON.parse(JSON.stringify(value));

		if (value.includes(username)) return res.send({ message: true });
		return findOnDB();
	});
});

module.exports = router;
