import express from 'express';
import cookieParser from 'cookie-parser';
import _bodyParser from 'body-parser';
import _helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import favicon from 'serve-favicon';
import { errorReporter } from 'express-youch';
import session from 'express-session';
import ms from 'ms';
import chalk from 'chalk';

import mongoStore from 'connect-mongo';
import passport from 'passport';

import { config } from '../../env';

module.exports = (app: express.Application) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static(path.join(__dirname, '../../public')));

	app.disable('x-powered-by');
	app.set('trust proxy', 1);
	app.use('/assets', express.static(path.join(__dirname, '../../src/assets')));
	app.use(favicon(path.join(__dirname, '../../public/favicon.ico')));
	app.use(
		session({
			secret: config.SESSION_SECRET,
			store: mongoStore.create({
				mongoUrl: config.MONGODB_URI,
			}),
			resave: false,
			saveUninitialized: true,
			cookie: { secure: false, maxAge: ms('1 week') },
		})
	);

	app.use(cookieParser());
	app.use(errorReporter());
	app.use(compression());
	app.use(passport.initialize());
	app.use(passport.session());

	// ! TODO configure helmet
	// if (dev == false) app.use(helmet());
	console.log(chalk.cyan('info  ') + '- Middleware loaded');
};
export {};
