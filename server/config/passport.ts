// * Here will be the passport configuration and strategies
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import axios from 'axios';

import User from '../models/users';

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
	new passportLocal.Strategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
			session: true,
		},
		async (req: any, email: string, password: string, done: any) => {
			try {
				let recaptcha = await axios({
					method: 'post',
					url: 'https://www.google.com/recaptcha/api/siteverify',
					params: {
						secret: process.env.RECAPTCHA_SECRET,
						response: req.body.recaptcha,
					},
				});
				if (!recaptcha.data.success) return done(null, false, { message: 'err-recaptcha' });

				let user = await User.findOne({ 'email.value': email });
				if (!user) return done(null, false, { message: 'err-wrong-credentials' });

				if (!bcrypt.compareSync(password, user.password)) return done(null, false, { message: 'err-wrong-credentials' });

				// TODO: Check the login zone, block if not on list of allowed zones

				await User.updateOne({ _id: user._id }, { lastLogin: Date.now() });
				return done(null, user);
			} catch (err) {
				return done(err);
			}
		}
	)
);
export {};
