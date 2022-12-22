import express from 'express';
import rateLimit from 'express-rate-limit';
import ms from 'ms';
import validator from 'validator';
import passport from 'passport';
import { z } from 'zod';

import Users from '../../models/user';

import * as accountsService from '../../services/auth';
import * as loggerService from '../../services/logger';

import type { User } from 'shared/types/models';
import { LoginResponse, RegisterResponse } from '../../../shared/types/api';

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
		max: 3,
		statusCode: 200,
		skipFailedRequests: true,
		skipSuccessfulRequests: false,
		message: 'rate-limit',
	}),
	async (req: express.Request, res: express.Response) => {
		// Check values provided in the request body
		const parsedBody = z
			.object({
				username: z
					.string()
					.max(16)
					.min(3)
					.refine((username: string) => {
						return validator.isAlphanumeric(username, 'en-GB', { ignore: '._' });
					}),
				email: z.string().refine(validator.isEmail),
				password: z.string().max(256).min(6),
				locale: z.enum(['en', 'es', 'fr', 'de']),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send('invalid-parameters' as RegisterResponse);

		try {
			// Register the account
			const result = await accountsService.registerAccount(parsedBody.data);
			if (!result.user) return res.send(400).send(result.error);

            // Login the user
			req.logIn(result.user, (err) => {
				if (err) throw err;
				return res.status(200).send('success' as RegisterResponse);
			});
		} catch (err) {
			loggerService.ApiError(req, res, err);
			res.status(500).send('server-error' as RegisterResponse);
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

		const parsedBody = z
			.object({
				password: z.string(),
				tfaCode: z.string().optional(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send('invalid-parameters');

		try {
			// If user haves tfa activated, verify it
			if (req.user.tfa.secret !== '') {
				if (!req.body.tfaCode || typeof req.body.tfaCode !== 'string')
					return res.status(400).send('invalid-parameters');

				const result: boolean = accountsService.verifyTFACode(req.body.tfaCode, req.user);
				if (result == false) return res.status(403).send('unauthorized');
			}

			// Delete from database
			await accountsService.deleteAccount(req.user.userID);

			// Logout the user
			accountsService.logoutUser(req);
			return res.status(200).send('success');
		} catch (err) {
			loggerService.ApiError(req, res, err);
			res.status(500).send('server-error');
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
		const parsedBody = z
			.object({
				email: z.string(),
				password: z.string(),
			})
			.required()
			.safeParse(req.body);

		if (!parsedBody.success) return res.status(400).send('invalid-parameters' as LoginResponse);

		try {
			passport.authenticate('local', (err: Error | null, user: User, result: string) => {
				if (err) throw err;
				if (!user) return res.status(200).send(result);

				// Login the user
				req.logIn(user, (err) => {
					if (err) throw err;
					return res.status(200).send('success' as LoginResponse);
				});
			})(req, res, next);
		} catch (err) {
			loggerService.ApiError(req, res, err);
			res.status(500).send('server-error' as LoginResponse);
		}
	}
);

router.get('/logout', (req: express.Request, res: express.Response) => {
	if (!req.isAuthenticated()) return res.redirect('/');

	try {
		accountsService.logoutUser(req);
		res.redirect('/');
	} catch (err) {
		loggerService.ApiError(req, res, err);
		res.status(500).send('server-error');
	}
});

// Check if values are used
router.post('/check-use', async (req: express.Request, res: express.Response) => {
	const bodyScheme = z
		.object({
			email: z.string(),
			username: z.string(),
		})
		.required();

	const parsedBody = bodyScheme.safeParse(req.body);
	if (!parsedBody.success) return res.status(400).send('invalid-parameters');

	try {
		// TODO: might change for redis later
		const emailUser: User | null = await Users.findOne({
			'email.value': parsedBody.data.email,
		});
		const usernameUser: User | null = await Users.findOne({
			username: parsedBody.data.username,
		});

		return res.status(200).send({
			emailInUse: emailUser !== null,
			usernameInUse: usernameUser !== null,
		});
	} catch (err) {
		loggerService.ApiError(req, res, err);
		res.status(500).send('server-error');
	}
});

module.exports = router;
