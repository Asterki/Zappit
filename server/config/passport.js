// * Here will be the passport configuration and strategies
const passport = require('passport');
const passportLocal = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/user');

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

passport.use(
	new passportLocal.Strategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
			session: true,
		},
		(req, email, password, done) => {
			if (!req.body.email || !req.body.password) return done(null, false, { message: 'err-missing-credentials' });
			if (req.user) return done(null, false, { message: 'err-logged-in' });

			const userExample = {
				email: 'asterki.dev@gmail.com',
				password: '$2b$10$k8U8AyqfEFgh8a6T26LpBuQizJTM4NHrnJOOS5kGLgP1wgl37UPfu', // 'water'
			};

			if (!bcrypt.compareSync(req.body.password, userExample.password)) return done(null, false, { message: 'err-wrong-password' });

			return done(null, userExample);

			// TODO: Uncomment this when the database is ready, and insert code here
			// User.findOne({ email: email }, (err, user) => {
			//     if (err) return done(err);
			//     if (!user) return done(null, false, { message: 'err-user-not-found' });

			// });
		}
	)
);
