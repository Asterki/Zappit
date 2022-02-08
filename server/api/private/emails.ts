// * This file is used for the API route
// * /api/private/emails/

import express from 'express';
import ms from 'ms';
import validator from 'validator';

import Users from '../../models/users';
import { accountsTransporter } from '../../config/nodemailer';
import { levelDB } from '../../config/databases';
import { saveError } from '../../utils/errors';

import cors from 'cors';
import rateLimit from 'express-rate-limit';
const router = express.Router();

router.use(
	cors({
		origin: process.env.HOST,
		optionsSuccessStatus: 200,
	})
);

// * Accounts
router.post(
	'/accounts/email-verification',
	rateLimit({
		windowMs: ms('6h'),
		max: 1,
		statusCode: 200,
		message: {
			message: 'err-rate-limit',
			code: 429,
		},
	}),
	async (req, res) => {
		// Callback function
		let done = (err: Error | null, code: number, message: string) => {
			if (err) {
				saveError(err);
				return res.send({ message: 'err-server-error', code: 500 });
			}
			return res.send({ message: message, code: code });
		};

		// Check validity of the body parameters
		let { lang, email } = req.body;
		if (!lang || !email || !validator.isEmail(email)) return done(null, 400, 'err-missing-parameters');
		if (typeof lang !== 'string' || typeof email !== 'string') return done(null, 400, 'err-invalid-parameters');

		try {
			// Get the user, return if not found
			let user = await Users.findOne({ 'email.value': email });
			if (!user) return done(null, 400, 'err-user-not-found');

			if (user.email.verified === true) return done(null, 400, 'err-email-already-verified');

			// Get the value from the table and parse it
			let verificationCodes = await levelDB.get('email-accounts-verification-codes');
			verificationCodes = JSON.parse(verificationCodes);

			// Push the code to the actual value, and then push it to the table
			let code = Math.floor(Math.random() * 900000) + 100000;
			verificationCodes.push({
				email: email,
				code: code,
				expires: Date.now() + ms('1h'),
			});
			await levelDB.put('email-accounts-verification-codes', JSON.stringify(verificationCodes));

			// Send the email
			let emailContent = require(`../../../emails/accounts/account-verification/${lang}`);
			await accountsTransporter.sendMail({
				from: '"Zappit"',
				to: email,
				subject: emailContent.subject.replace(/{username}/g, user.username),
				html: emailContent.html.replace(/{username}/g, user.username).replace(/{verification_code}/g, code),
			});

			return res.send({ message: 'ok', code: 200 });
		} catch (err: any) {
			done(err, 500, 'err-server-error');
		}
	}
);

module.exports = router;
