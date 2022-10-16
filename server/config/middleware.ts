// Dependencies
import express from 'express';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import chalk from 'chalk';

import { app, launchArgs } from '../index';

try {
	app.disable('x-powered-by');
	app.set('trust proxy', 1);

	// Requests
	app.use(
		bodyParser.urlencoded({
			extended: true,
		})
	);
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(compression());

	// Static content
	app.use(favicon(path.join(__dirname, '../../public/favicon.ico')));
	app.use('/', express.static(path.join(__dirname, '../../public/')));
	// app.use("/assets/", express.static(path.join(__dirname, "../../src/assets")));
	// app.use("/avatars/", express.static(path.join(__dirname, avatarsPath)));

	// Security, which is disabled in development mode
	if (launchArgs.dev == false) {
		app.use(helmet.contentSecurityPolicy());
		app.use(
			helmet.crossOriginEmbedderPolicy({
				policy: 'require-corp',
			})
		);
		app.use(
			helmet.crossOriginOpenerPolicy({
				policy: 'same-origin',
			})
		);
		app.use(
			helmet.crossOriginResourcePolicy({
				policy: 'same-origin',
			})
		);
		app.use(
			helmet.dnsPrefetchControl({
				allow: false,
			})
		);
		app.use(
			helmet.expectCt({
				maxAge: 0,
			})
		);
		app.use(
			helmet.frameguard({
				action: 'sameorigin',
			})
		);
		app.use(
			helmet.hsts({
				maxAge: 15552000,
				includeSubDomains: true,
			})
		);
		app.use(
			helmet.permittedCrossDomainPolicies({
				permittedPolicies: 'none',
			})
		);
		app.use(
			helmet.referrerPolicy({
				policy: 'no-referrer',
			})
		);
		app.use(helmet.ieNoOpen());
		app.use(helmet.hidePoweredBy());
		app.use(helmet.noSniff());
		app.use(helmet.originAgentCluster());
		app.use(helmet.xssFilter());
	}

	console.log(`${chalk.cyanBright('info ')} - Middleware loaded`);
} catch (err) {
	console.log(`${chalk.redBright('error')} - There was an error loading the middleware`);
	console.log(err);
}

export {};
