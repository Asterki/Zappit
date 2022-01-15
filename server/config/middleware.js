const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const compression = require('compression');
const favicon = require('serve-favicon');
const { errorReporter } = require('express-youch');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const passport = require('passport');

const dev = process.env.NODE_ENV !== 'production';

module.exports = (app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static(path.join(__dirname, '../../public')));

	app.disable('x-powered-by');
	app.set('trust proxy', 1);
	app.use('/assets', express.static(path.join(__dirname, '../../src/assets')));
	app.use(favicon(path.join(__dirname, '../../public/favicon.ico')));
	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			store: mongoStore.create({
				mongoUrl: process.env.MONGODB_URI,
			}),
			resave: false,
			saveUninitialized: true,
			cookie: { secure: false },
		})
	);

	app.use(cookieParser());
	app.use(errorReporter());
	app.use(compression());
	app.use(passport.initialize());
	app.use(passport.session());

	if (dev == false) app.use(helmet());
};
