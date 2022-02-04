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
	})
);

router.post('/accounts/isEmailTaken', (req, res) => {
	const { email } = req.body;

	cache.get('checks_email_in_use', (err, value) => {
		let findOnDB = () => {
			Users.find({ 'email.value': new RegExp('^' + email.substring(0, 4)) }, (err, docs) => {
				if (err) return res.send({ success: false, error: 'err-server-error' });

				let emails = [];
				docs.forEach((doc) => emails.push(doc.email.value));

				let parsedValue = JSON.parse(value);
				emails.forEach((email) => parsedValue.push(email));

				cache.put('checks_email_in_use', JSON.stringify(parsedValue), (err) => {
					if (err) console.log(err);
				});

				return res.send({ result: parsedValue.includes(email) });
			});
		};

		if (err instanceof level.errors.NotFoundError) return findOnDB();
		value = JSON.parse(JSON.stringify(value));

		if (value.includes(email)) return res.send({ result: true });
		return findOnDB();
	});
});

router.post('/accounts/isUsernameTaken', (req, res) => {
	const { username } = req.body;

	cache.get('checks_username_in_use', (err, value) => {
		let findOnDB = () => {
			Users.find({ 'username': new RegExp('^' + username.substring(0, 4)) }, (err, docs) => {
				if (err) return res.send({ success: false, error: 'err-server-error' });

				let usernames = [];
				docs.forEach((doc) => usernames.push(doc.username.value));

				let parsedValue = JSON.parse(value);
				usernames.forEach((username) => parsedValue.push(username));

				cache.put('checks_username_in_use', JSON.stringify(parsedValue), (err) => {
					if (err) console.log(err);
				});

				return res.send({ result: parsedValue.includes(username) });
			});
		};

		if (err instanceof level.errors.NotFoundError) return findOnDB();
		value = JSON.parse(JSON.stringify(value));

		if (value.includes(username)) return res.send({ result: true });
		return findOnDB();
	})
});

module.exports = router;
