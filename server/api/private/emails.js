// * This file is used for the API route
// * /api/private/emails/

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const chalk = require('chalk');
const ms = require('ms');
const uuid = require('uuid');

const Users = require('../../models/users');
const { accountsTransporter } = require('../../config/nodemailer');
const { levelDB } = require('../../config/databases');

const router = express.Router();
router.use(
	cors({
		origin: process.env.HOST,
		optionsSuccessStatus: 200,
	})
);

router.post(
	'/emailVerification',
	rateLimit({
		windowMs: ms('6h'),
		max: 100,
		message: {
			success: false,
			message: 'err-rate-limit',
		},
	}),
	(req, res) => {
		if (!req.body.email || !req.body.lang) return res.status(200).send({ success: false, message: 'missing-body-parameters' });

		Users.findOne({ 'email.value': req.body.email }, (err, user) => {
			// Check if user exists, if so, check if the email is already veriied
			if (err) return res.status(200).send({ success: false, message: 'err-server-error' });
			if (!user) return res.status(200).send({ success: false, message: 'err-user-not-found' });
			if (user.email.verified) return res.status(200).send({ success: false, message: 'err-email-verified' });

			// Get the current value of the collection, parse them, and if its null, set it to an empty array
			levelDB.get('emailVerificationTokens', async (err, emailVerificationTokens) => {
				emailVerificationTokens = JSON.parse(emailVerificationTokens);

				// Create the token that will be saved to the collection and sent to the user's email
				let emailVerificationToken = {
					token: uuid.v4(),
					email: req.body.email,
					expires: Date.now() + ms('1h'),
				};

				emailVerificationTokens.push(emailVerificationToken);
				await levelDB.put('emailVerificationTokens', JSON.stringify(emailVerificationTokens));

				// Get the email's template using the language provided, then send it to the user's registered email
				let emailCotent = require(`../../../emails/accounts/account-verification/${req.body.lang}`);
				accountsTransporter.sendMail(
					{
						from: '"Zappit"',
						to: user.email.value,
						subject: emailCotent.subject.replace(/{username}/g, user.username),
						html: emailCotent.html
							.replace(/{username}/g, user.username)
							.replace(/{verification_token}/g, emailVerificationToken.token),
					},
					(err, info) => {
						if (err) throw err;
						return res.send({ success: true, message: 'email-sent' });
					}
				);
			});
		});
	}
);

module.exports = router;
