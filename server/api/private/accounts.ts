// * This file is used for the API route
// * /api/private/accounts/

import * as express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import validator from 'validator';
import uuid from 'uuid';
import ms from 'ms';

import User from '../../models/users';
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

router.post(
	'/login',
	rateLimit({
		windowMs: ms('1h'),
		max: 5,
		statusCode: 200,
		message: {
			message: 'err-rate-limit',
			code: 429,
		},
	}),
	async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		let { email, password, recaptcha } = req.body;
		let done: Function = (err: Error | null, code: number, message: string) => {
			if (err) {
				saveError(err);
				return res.send({ message: 'err-server-error', code: 500 });
			}
			return res.send({ message: message, code: code });
		};

		if (!email || !password || !recaptcha) return done(null, 400, 'err-missing-body-parameters');
		if (req.user) return done(null, 400, 'err-logged-in');

		if (typeof email !== 'string' || typeof password !== 'string' || typeof recaptcha !== 'string')
			return done(null, 400, 'err-invalid-body-parameters');

		try {
			passport.authenticate('local', (_err: Error | null, user: object, info: { message: string }) => {
				if (!user) return res.send({ message: info.message, code: 403 });
				req.logIn(user, (err) => {
					throw err;
				});

				return res.send({ message: 'ok', code: 200 });
			})(req, res, next);
		} catch (err) {
			done(err, 500, 'err-server-error');
		}
	}
);

router.post(
	'/register',
	rateLimit({
		windowMs: ms('1d'),
		max: 1,
		statusCode: 200,
		message: {
			message: 'err-rate-limit',
			code: 429,
		},
	}),
	async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
		let { username, email, password } = req.body;
		let done: Function = (err: Error | null, code: number, message: string) => {
			if (err) {
				saveError(err);
				return res.send({ message: 'err-server-error', code: 500 });
			}
			return res.send({ message: message, code: code });
		};

		if (!username || !email || !password) return done(null, 400, 'err-missing-body-parameters');
		if (req.user) return done(null, 400, 'err-logged-in');
		if (
			typeof username !== 'string' ||
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			username.length > 24 ||
			username.length < 3 ||
			!validator.isEmail(email) ||
			password.length < 8 ||
			password.length > 128
		)
			return done(null, 400, 'err-invalid-body-parameters');

		try {
			let result = await User.findOne({ $or: [{ 'email.value': email }, { username: username.toLowerCase() }] });
			if (result) return res.send({ message: 'err-username-taken', code: 400 });

			let user = new User({
				username: username.toLowerCase(),
				email: {
					value: email,
					verified: false,
				},
				password: bcrypt.hashSync(password, 10),
				userID: uuid.v4(),
			});

			user.save((err: Error | null, result: any) => {
				if (err) throw err;

				req.logIn(result, (err) => {
					if (err) throw err;
				});

				return res.status(200).send({ code: 200, message: 'ok' });
			});
		} catch (err) {
			saveError(err);
			return res.send({ message: 'err-server-error', code: 500 });
		}
	}
);

router.post(
	'/verify-email',
	rateLimit({
		windowMs: ms('1h'),
		max: 5,
		statusCode: 200,
		message: {
			code: 429,
			message: 'err-rate-limit',
		},
	}),
	async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
		let { code, email } = req.body;
		let done: Function = (err: Error | null, code: number, message: string) => {
			if (err) {
				saveError(err);
				return res.send({ message: 'err-server-error', code: 500 });
			}
			return res.send({ message: message, code: code });
		};

		if (!code || !email) return done(null, 400, 'err-missing-body-parameters');
		if (typeof code !== 'string' || typeof email !== 'string' || code.length !== 6) return done(null, 400, 'err-invalid-body-parameters');

		try {
			interface EmailVerificationCode {
				code: string;
				email: string;
				expires: number;
			}

			let result: string = await levelDB.get('email-accounts-verification-codes');
			let codes: Array<EmailVerificationCode> = JSON.parse(result);

			let found: any = codes.find((element: EmailVerificationCode) => element.code == code && element.email == email);
			if (!found) return done(null, 400, 'err-invalid-code');
			if (found.expires < Date.now()) return res.send({ message: 'err-code-expired', code: 400 });

			codes = codes.filter((code) => code.code !== found.code);

			await levelDB.put('email-accounts-verification-codes', JSON.stringify(codes));
		} catch (err) {
			saveError(err);
			return res.send({ message: 'err-server-error', code: 500 });
		}
	}
);

router.get(
	'/logout',
	rateLimit({
		windowMs: ms('6h'),
		max: 30,
		statusCode: 200,
		message: {
			message: 'err-rate-limit',
			code: 429,
		},
	}),
	(req: express.Request, res: express.Response, _next: express.NextFunction) => {
		if (!req.user) return res.send({ message: 'err-not-logged-in', code: 403 });

		req.logout();
		res.redirect('/');
	}
);

module.exports = router;
