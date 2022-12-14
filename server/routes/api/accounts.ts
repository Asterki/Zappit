import express from 'express';
import rateLimit from 'express-rate-limit';
import ms from 'ms';
import validator from 'validator';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { string, z } from "zod"
import { v4 as uuidv4 } from 'uuid';

import Users from '../../models/user';

import { checkTFA } from '../../helpers/accounts';
import { logError } from '../../helpers/logs';
// import { redisClient } from '../config/databases';s

import type { User } from 'shared/types/models';

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
		max: 132,
		statusCode: 200,
		skipFailedRequests: true,
		skipSuccessfulRequests: false,
		message: 'rate-limit',
	}),
	async (req: express.Request, res: express.Response) => {
		// Check values provided in the request body
		const bodyScheme = z.object({
			username: z.string().max(16).min(3).refine((username) => { return validator.isAlphanumeric(username, 'en-GB', { ignore: '._' }) }),
			email: z.string().refine(validator.isEmail),
			password: z.string().max(256).min(6),
			locale: string().max(2).min(2).optional().default("en")
		}).required()

		const parsedBody = bodyScheme.safeParse(req.body)
		if (!parsedBody.success) return res.status(400).send("invalid-parameters")

		try {
			// Find if the username is already registered
			const result = await Users.findOne({
				$or: [
					{
						'email.value': parsedBody.data.email.toLowerCase(),
					},
					{
						username: parsedBody.data.username.toLowerCase(),
					},
				],
			});
			if (result) return res.status(400).send('err-username-or-email-taken');

			// Create the new user
			const userID = uuidv4().split('-').join('');

			const user = new Users({
				userID: userID,
				createdAt: Date.now(),

				username: parsedBody.data.username.toLowerCase(),
				displayName: parsedBody.data.username.toLowerCase(),

				email: {
					value: parsedBody.data.email.toLowerCase(),
				},

				preferences: {
					locale: parsedBody.data.locale,
				},

				password: bcrypt.hashSync(parsedBody.data.password, 10),
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
		// Block not logged in users
		if (!req.isAuthenticated() || !req.user) return res.status(403).send('unauthorized');

		const bodyScheme = z.object({
			password: z.string(),
			tfaCode: z.string().optional()
		}).required()

		const parsedBody = bodyScheme.safeParse(req.body)
		if (!parsedBody.success) return res.status(400).send("invalid-parameters")

		try {
			// If user haves tfa activated, verify it
			if (req.user.tfa.secret !== '') {
				if (!req.body.tfaCode || typeof req.body.tfaCode !== 'string') return res.status(400).send('invalid-parameters');

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
		const bodyScheme = z.object({
			email: z.string(),
			password: z.string()
		}).required()

		const parsedBody = bodyScheme.safeParse(req.body)
		if (!parsedBody.success) return res.status(400).send("invalid-parameters")

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

// Check if values are used
router.post('/check-use', async (req: express.Request, res: express.Response) => {
	const bodyScheme = z.object({
		email: z.string(),
		username: z.string()
	}).required()

	const parsedBody = bodyScheme.safeParse(req.body)
	if (!parsedBody.success) return res.status(400).send('invalid-parameters');

	try {
		// TODO: might change for redis later
		const emailUser: User | null = await Users.findOne({ 'email.value': parsedBody.data.email });
		const usernameUser: User | null = await Users.findOne({ username: parsedBody.data.username });

		return res.status(200).send({
			emailInUse: emailUser !== null,
			usernameInUse: usernameUser !== null,
		});
	} catch (err) {
		logError(err);
		return res.status(500).send('server-error');
	}
});

module.exports = router;
