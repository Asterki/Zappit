import express from 'express';
import rateLimit from 'express-rate-limit';
import ms from 'ms';
import validator from 'validator';
import bcrypt from 'bcrypt';
import passport from 'passport';
import speakeasy from 'speakeasy';
import { v4 as uuidv4 } from 'uuid';

import Users from '../models/user';
// import UsersData from '../models/user';

import { checkTFA } from '../utils/accounts';
import { logError } from '../utils/logs';
import { redisClient } from '../config/databases';

import { User } from '../types';
const router = express.Router();

declare module 'express-serve-static-core' {
	interface Request {
		user?: User;
	}
}

// Account creation/deletion
router.post(
	'/register',
	rateLimit({
		windowMs: ms('12h'),
		max: 1,
		statusCode: 200,
		skipFailedRequests: true,
		skipSuccessfulRequests: false,
		message: 'rate-limit',
	}),
	async (req: express.Request, res: express.Response) => {
		if (!req.body) return res.status(400).send('missing-parameters');
		// Don't allow already logged in users to register a new account
		if (req.isAuthenticated() || req.user) return res.status(403).send('unauthorized');

		// If all arguments are there and are the right type
		const { username, email, password, displayName, locale } = req.body;
		if (!username || !email || !password || !displayName) return res.status(400).send('missing-parameters');
		if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof displayName !== 'string')
			return res.status(400).send('invalid-parameters');

		// Checks
		if (username.length < 3 || username.length > 14) return res.status(400).send('invalid-username');
		if (displayName.length > 24) return res.status(400).send('invalid-display-name');
		if (!validator.isEmail(email)) return res.status(400).send('invalid-email');
		if (password.length < 6 || password.length > 256) return res.status(400).send('invalid-password');

		try {
			// Find if the username is already registered
			const result = await Users.findOne({
				$or: [
					{
						'email.value': email.toLowerCase(),
					},
					{
						username: username.toLowerCase(),
					},
				],
			});
			if (result) return res.status(400).send('err-username-or-email-taken');

			// Create the new user
			const userID = uuidv4();

			const user = new Users({
				username: username.toLowerCase(),
				email: {
					value: email.toLowerCase(),
					verified: false,
				},
				password: bcrypt.hashSync(password, 10),
				userID: userID,

				locale: locale,

				tfa: {
					secret: '',
					backupCodes: [],
				},
			});

			// Save the user to the database
			user.save((err: Error | null, result: User) => {
				if (err) throw err;

				req.logIn(result, (err: Error) => {
					if (err) throw err;
					return res.status(200).send('success');
				});
			});
		} catch (err) {
			logError(err);
			return res.status(500).send('server-error');
		}
	}
);

router.post(
	'/delete-account',
	rateLimit({
		windowMs: ms('12h'),
		max: 1,
		statusCode: 200,
		skipFailedRequests: true,
		skipSuccessfulRequests: false,
		message: 'rate-limit',
	}),
	async (req: express.Request, res: express.Response) => {
		if (!req.body) return res.status(400).send('missing-parameters');
		// Block not logged in users
		if (!req.isAuthenticated() || !req.user) return res.status(403).send('unauthorized');

		const { password } = req.body;
		if (!password) return res.status(400).send('missing-parameters');
		if (typeof password !== 'string') return res.status(400).send('invalid-parameters');

		try {
			// If user haves tfa activated, verify it
			if (req.user.tfa.secret !== '') {
				if (!req.body.tfaCode) return res.status(400).send('missing-parameters');
				if (typeof req.body.tfaCode !== 'string') return res.status(400).send('invalid-parameters');

				const result = checkTFA(req.body.tfaCode, req.user);
				if (result == false) return res.status(403).send('unauthorized');
			}

			// Delete from database
			await Users.deleteOne({
				userID: req.body.userID,
			});

			// Logout the user
			req.logout((err: any) => {
				if (err) throw err;
				return res.status(200).send('success');
			});
		} catch (err) {
			logError(err);
			return res.status(500).send('server-error');
		}
	}
);

// Account access
router.post(
	'/login',
	rateLimit({
		windowMs: ms('1h'),
		max: 10,
		statusCode: 200,
		message: 'rate-limit',
	}),
	(req: express.Request, res: express.Response, next: express.NextFunction) => {
		if (!req.body) return res.status(400).send('missing-parameters');
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).send('missing-parameters');
		if (typeof email !== 'string' || typeof password !== 'string') return res.status(400).send('invalid-parameters');

		try {
			passport.authenticate('local', (err: Error | null, user: User, result: string) => {
				if (err) throw err;
				if (!user) return res.status(200).send(result);

				// Login the user
				req.logIn(user, (err) => {
					if (err) throw err;
					return res.status(200).send('success');
				});
			})(req, res, next);
		} catch (err) {
			logError(err);
			return res.status(500).send('server-error');
		}
	}
);

router.get('/logout', (req: express.Request, res: express.Response) => {
	if (!req.body) return res.status(400).send('missing-parameters');
	if (!req.isAuthenticated()) return res.redirect('/');

	try {
		req.logout((err: any) => {
			if (err) throw err;
			res.redirect('/');
		});
	} catch (err) {
		logError(err);
		return res.status(500).send('server-error');
	}
});

// TFA
router.post(
	'/activate-tfa',
	rateLimit({
		windowMs: ms('1h'),
		max: 3,
		statusCode: 200,
		message: 'rate-limit',
	}),
	async (req: express.Request, res: express.Response) => {
		if (!req.body) return res.status(400).send('missing-parameters');
		if (!req.isAuthenticated() || !req.user) return res.status(400).send('unauthorized');

		try {
			if (req.user.tfa.secret !== '') return res.status(400).send('already-activated');

			const secret: any = speakeasy.generateSecret({
				length: 20,
			});
			req.user.tfa.secret = secret.base32;

			// Update to the database
			await Users.updateOne(
				{
					userID: req.user.userID,
				},
				{
					tfa: req.user.tfa,
				}
			);

			return res.status(200).send({
				code: secret.base32,
			});
		} catch (err: any) {
			logError(err);
			return res.status(500).send('server-error');
		}
	}
);

router.post(
	'/deactivate-tfa',
	rateLimit({
		windowMs: ms('1h'),
		max: 3,
		statusCode: 200,
		message: 'rate-limit',
	}),
	async (req: express.Request, res: express.Response) => {
		if (!req.body) return res.status(400).send('missing-parameters');
		if (!req.isAuthenticated() || !req.user) return res.status(403).send('unauthorized');

		try {
			if (req.user.tfa.secret == '') return res.status(400).send('not-activated');
			req.user.tfa.secret = '';
			req.user.tfa.backupCodes = [];

			await Users.updateOne(
				{
					userID: req.user.userID,
				},
				{
					tfa: req.user.tfa,
				}
			);
			res.status(200).send('success');
		} catch (err: any) {
			logError(err);
			return res.status(500).send('server-error');
		}
	}
);

router.post(
	'/get-backup-tfa-codes',
	rateLimit({
		windowMs: ms('1h'),
		max: 3,
		statusCode: 200,
		message: 'rate-limit',
	}),
	async (req: express.Request, res: express.Response) => {
		if (!req.body) return res.status(400).send('missing-parameters');
		if (!req.isAuthenticated() || !req.user) return res.status(403).send('unauthorized');
		if (!req.body.tfaCode) return res.status(400).send('missing-parameters');
		if (typeof req.body.tfaCode !== 'string') return res.status(400).send('invalid-parameters');

		try {
			// Must be a code generated by the authentication app
			const verified = speakeasy.totp.verify({
				secret: req.user.tfa.secret,
				encoding: 'base32',
				token: req.body.tfaCode,
			});

			if (!verified) return res.status(200).send('invalid-tfa-code');

			// Generate Codes
			const codeList: Array<string> = [];
			for (let i = 0; i < 10; i++) {
				codeList.push(Math.random().toString(16).slice(2, 10).toLowerCase());
			}

			// Hash the generated codes (These will be stored in the database)
			const hashedCodes: Array<string> = [];
			codeList.forEach((code: string) => {
				hashedCodes.push(bcrypt.hashSync(code, 10));
			});

			// Update to the database
			req.user.tfa.backupCodes = hashedCodes;
			await Users.updateOne(
				{
					userID: req.user.userID,
				},
				{
					tfa: req.user.tfa,
				}
			);

			return res.status(200).json(codeList);
		} catch (err: any) {
			logError(err);
			return res.status(500).send('server-error');
		}
	}
);

// Check if values are used
router.post('/check-use', async (req: express.Request, res: express.Response) => {
	if (!req.body) return res.status(400).send('missing-parameters');
	const { test, value } = req.body;
	if (!test || !value) return res.status(400).send('missing-parameters');
	if (typeof test !== 'string' || typeof value !== 'string') return res.status(400).send('invalid-parameters');

	try {
		const valueListRaw = await redisClient.get(test == 'username' ? 'checks-usernames' : 'checks-emails');
		if (valueListRaw == null) return res.status(200).send('not-in-use');

		const valueList: Array<string> = JSON.parse(valueListRaw);
		return res.status(200).send(valueList.includes(value));
	} catch (err) {
		logError(err);
		return res.status(500).send('server-error');
	}
});

module.exports = router;
