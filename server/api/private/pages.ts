// * This file is used for the API route
// * /api/private/pages/

import express from 'express';
import ms from 'ms';

import { getLang } from '../../utils/locales';

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
	})
);

// * Main
router.get('/main/index', (req: { headers: any }, res: express.Response) => {
	let lang = getLang(req.headers['accept-language'])['main']['index'];
	return res.send({ lang: lang });
});

// * Accounts
router.get('/accounts/login', (req: { headers: any }, res: express.Response) => {
	let lang = getLang(req.headers['accept-language'])['accounts']['login'];
	return res.send({ lang: lang });
});

router.get('/accounts/register', (req: { headers: any }, res: express.Response) => {
	let lang = getLang(req.headers['accept-language'])['accounts']['register'];
	return res.send({ lang: lang });
});

module.exports = router;
