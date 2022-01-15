const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const User = require('../../models/user');
const emailTransporters = require('../../config/nodemailer');

router.use(
	cors({
		origin: process.env.HOST,
		optionsSuccessStatus: 200,
	})
);
router.use(
	rateLimit({
		windowMs: ms('6h'),
		max: 1,
		message: {
			success: false,
			message: 'err-rate-limit',
		},
	})
);

app.post('/verifyEmail', (req, res) => {
	if (!req.body.email) return res.status(200).send({ success: false, message: 'err-missing-email' });

	User.findOne({ 'email.value': req.body.email }, (err, user) => {
		if (err) return res.status(200).send({ success: false, message: 'err-server-error' });
		if (!user) return res.status(200).send({ success: false, message: 'err-email-not-found' });
		if (user.email.verified) return res.status(200).send({ success: false, message: 'err-email-verified' });

		let emailCotent = require(`../../../emails/accounts/account-verification/en`);
		let mailOptions = {
			from: '"Zappit"',
			to: 'asterki.user@gmail.com',
			subject: emailCotent.subject.replace(/{username}/g, user.username),
			html: emailCotent.html
				.replace(/{username}/g, user.username)
				.replace(/{verification_token}/g, `${process.env.APP_URL}/api/private/accounts/verify/eiwqueioqweuoiqweujowi`),
		};

		accountsTransporter.sendMail(mailOptions, (err, info) => {
			if (err) return console.log(err);
			console.log(info);
		});
	});
});

module.exports = router;
