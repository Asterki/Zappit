// * This file is used for the API route
// * /api/private/checks/

import express from 'express';
import ms from 'ms';
import validator from 'validator';

import { cache } from '../../config/databases';
import Users from '../../models/users';
import { saveError } from '../../utils/errors';

import rateLimit from 'express-rate-limit';
import cors from 'cors';
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

router.post('/accounts/is-email-taken', async (req, res) => {
	const { email } = req.body;
	let done = (error: Error | null, code: number, message: string) => {
		if (error) {
			saveError(error);
			return res.send({ message: 'err-server-error', code: 500 });
		}
		return res.send({ message: message, code: code });
	};

	if (!email) return done(null, 400, 'err-missing-body-parameters');
	if (typeof email !== 'string' || !validator.isEmail(email)) return done(null, 400, 'err-invalid-body-parameters');

	try {
		let findOnDB = async () => {
			let docs = await Users.find({ 'email.value': new RegExp('^' + email.substring(0, 4)) });

			let emails: Array<string> = [];
			docs.forEach((doc: any) => emails.push(doc.email.value));

			let parsedValue = JSON.parse(value);
			emails.forEach((email) => parsedValue.push(email));

			await cache.put('checks-accounts-is-email-taken', JSON.stringify(parsedValue));
			return res.send({ result: parsedValue.includes(email) });
		};

		let value: string = await cache.get('checks-accounts-is-email-taken');

		if (value) {
			value = JSON.parse(JSON.stringify(value));

			if (value.includes(email)) return res.send({ message: true, code: 200 });
			return findOnDB();
		}
	} catch (err: any) {
		return done(err, 500, 'err-server-error');
	}
});

router.post('/accounts/is-username-taken', async (req, res) => {
	const { username } = req.body;
	let done = (error: Error | null, code: number, message: string) => {
		if (error) {
			saveError(error);
			return res.send({ message: 'err-server-error', code: 500 });
		}
		return res.send({ message: message, code: code });
	};

	if (!username) return done(null, 400, 'err-missing-body-parameters');
	if (typeof username !== 'string') return done(null, 400, 'err-invalid-body-parameters');

	try {
		let findOnDB = async () => {
			let docs = await Users.find({ 'email.value': new RegExp('^' + username.substring(0, 4)) });

			let usernames: Array<string> = [];
			docs.forEach((doc: any) => usernames.push(doc.email.value));

			let parsedValue = JSON.parse(value);
			usernames.forEach((usernames) => parsedValue.push(usernames));

			await cache.put('checks-accounts-is-username-taken', JSON.stringify(parsedValue));
			return res.send({ result: parsedValue.includes(usernames) });
		};

		let value: string = await cache.get('checks-accounts-is-username-taken');

		if (value) {
			value = JSON.parse(JSON.stringify(value));

			if (value.includes(username)) return res.send({ message: true, code: 200 });
			return findOnDB();
		}
	} catch (err: any) {
		return done(err, 500, 'err-server-error');
	}
});

module.exports = router;
