// * This file is used for the API route
// * /api/private/checks/

const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const ms = require('ms');

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
	if (req.body.email == 'asterki.dev@gmail.com') return res.status(200).send({ result: true });
	else {
		return res.status(200).send({ result: false });
	}
});

router.post('/accounts/isUsernameTaken', (req, res) => {
	if (req.body.username == 'asterki') return res.status(200).send({ result: true });
	else {
		return res.status(200).send({ result: false });
	}
});

module.exports = router;
