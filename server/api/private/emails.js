// * This file is used for the API route
// * /api/private/emails/

const express = require('express');
const ms = require('ms');
const uuid = require('uuid');

const Users = require('../../models/users');
const { accountsTransporter } = require('../../config/nodemailer');
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
	(req, res) => {
		let { lang, email } = req.body;
		if (!lang || !email) return res.send({ message: 'missing-body-parameters', code: 400 });

		Users.findOne({ 'email.value': email }, (err, user) => {
			if (err) return res.send({ message: 'err-server-error', code: 500 });
			if (!user) return res.send({ message: 'err-user-not-found', code: 400 });

			let code = Math.floor(Math.random() * 900000) + 100000;
			levelDB.get('email-accounts-verification-codes', (err, value) => {
				if (err) return res.send({ message: 'err-server-error', code: 500 });

				value = JSON.parse(value);
				value.push({
					email: email,
					code: code,
					expires: Date.now() + ms('1h'),
				});

				levelDB.put('email-accounts-verification-codes', JSON.stringify(value), (err) => {
					if (err) return res.send({ message: 'err-server-error', code: 500 });

					let emailContent = require(`../../../emails/accounts/account-verification/${lang}`);
					accountsTransporter.sendMail(
						{
							from: '"Zappit"',
							to: email,
							subject: emailContent.subject.replace(/{username}/g, user.username),
							html: emailContent.html.replace(/{username}/g, user.username).replace(/{verification_code}/g, code),
						},
						(err, info) => {
							if (err) return res.send({ message: 'err-server-error', code: 500 });
							res.send({ message: 'ok', code: 200 });
						}
					);
				});
			});
		});
	}
);

module.exports = router;
