import passport from 'passport';
import passportLocal from 'passport-local';
import express from 'express';
import bcrypt from 'bcrypt';
import expressSession from 'express-session';
import mongoStore from 'connect-mongo';
import speakeasy from "speakeasy"
import { v4 as uuidv4 } from 'uuid';

import Users from '../models/user';
import { app } from '..';

import type { RegisterRequestBody } from "../../shared/types/api"
import type { User } from '../../shared/types/models';

import { RegisterUserReturnType } from '../types/services';

// For authentication on each request
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

// Cookie session
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET as string,
		resave: false,
		saveUninitialized: true,
		store: mongoStore.create({
			mongoUrl: process.env.MONGODB_URI as string,
		}),
		name: 'session',
		cookie: {
			secure: (process.env.COOKIE_SECURE as string) == 'true',
			maxAge: parseInt(process.env.COOKIE_MAX_AGE as string) || 604800000,
			sameSite: true,
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());

// Passport login strategy 
passport.use(
	new passportLocal.Strategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
			session: true,
		},
		async (req: express.Request, _email: string, _password: string, done: any) => {
			try {
				const user: User | null = await Users.findOne({
					$or: [{ 'email.value': req.body.email }, { username: req.body.email }],
				});

				if (!user) return done(null, false, 'invalid-credentials');

				if (!bcrypt.compareSync(req.body.password, user.password)) return done(null, false, 'invalid-credentials');
				if (user.banned == true) return done(null, false, 'disabled')

				if (user.tfa.secret) {
					if (!req.body.tfaCode) return done(null, false, 'missing-tfa-code');
					if (typeof req.body.tfaCode !== 'string') return done(null, false, 'invalid-tfa-code');

					const result = verifyTFACode(req.body.tfaCode, user);
					if (result == false) return done(null, false, 'invalid-tfa-code');
				}

				// TODO: Add the device to the users' logged in devices
				// TODO: Mail the user

				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);


export const registerAccount = async (userData: RegisterRequestBody): Promise<RegisterUserReturnType> => {
	// Find if the username is already registered
	const isEmailOrUsernameRegistered = await Users.findOne({
		$or: [
			{
				'email.value': userData.email.toLowerCase(),
			},
			{
				username: userData.username.toLowerCase(),
			},
		],
	});
	if (isEmailOrUsernameRegistered) return { error: "err-username-or-email-taken", user: null }

	// Create the new user
	const userID = uuidv4().split('-').join('');
	const user = new Users({
		userID: userID,
		createdAt: Date.now(),

		username: userData.username.toLowerCase(),
		displayName: userData.username.toLowerCase(),

		email: {
			value: userData.email.toLowerCase(),
		},

		preferences: {
			locale: userData.locale,
		},

		password: bcrypt.hashSync(userData.password, 10),
	});

	// Save the user to the database
	const userSavedResult = await user.save()

	return { error: null, user: userSavedResult }
}

export const deleteAccount = async (userID: string): Promise<boolean> => {
	await Users.deleteOne({
		userID: userID,
	});

	return true
}

export const loginUser = (user: User, req: express.Request): void => {
	req.logIn(user, (err: any | null) => {
		if (err) throw err
	})
}

export const logoutUser = (req: express.Request): void => {
	req.logout((err: any) => {
		if (err) throw err;
	});
}

export const verifyTFACode = (tfaCode: string, user: User): boolean => {
	if (tfaCode.length == 6) {
		const verified = speakeasy.totp.verify({
			secret: user.tfa.secret,
			encoding: 'base32',
			token: tfaCode,
		});

		return verified;
	} else {
		let backupCodeVerified = false;

		user.tfa.backupCodes.forEach((backupCode: string, index: number) => {
			if (backupCode == null) return;
			if (!bcrypt.compareSync(tfaCode, backupCode)) return;

			backupCodeVerified = true;

			// Remove the code
			delete user.tfa.backupCodes[index];
			Users.updateOne({ 'email.value': user.userID }, { tfa: user.tfa });
		});

		return backupCodeVerified;
	}
}