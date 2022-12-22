import express from 'express';
import next from 'next';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';

import minimist from 'minimist';
import path from 'path';
import chalk from 'chalk';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const launchArgs = minimist(process.argv.slice(2), {
	string: ['port'],
	boolean: ['dev'],

	default: {
		dev: true,
		port: 8080,
	},
});

const app = express();
const server = http.createServer(app);
const nextApp = next({ dev: launchArgs.dev, httpServer: server });

nextApp.prepare().then(() => {
	const handle = nextApp.getRequestHandler();

	app.disable('x-powered-by');
	app.set('trust proxy', 1);

	app.use(
		bodyParser.urlencoded({
			extended: true,
		})
	);
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use(compression());

	// Services
	require("./services/auth")
	require("./services/controllers")
	require("./services/databases")
    
	// Routes
	require("./routes/index")

	// Handle next.js routing
	app.get('*', (req: express.Request, res: express.Response) => {
		handle(req, res);
	});

	// Start the server
	server.listen(launchArgs.port, () => {
		console.log(`${chalk.magenta('event')} - Server running in ${launchArgs.dev == true ? 'development' : 'production'} mode at ${launchArgs.port}`);
	});

	server.on('error', (error: any) => {
		if (error.code === 'EADDRINUSE') {
			console.log('Address in use, retrying...');
			setTimeout(() => {
				server.close();
				server.listen(launchArgs.port);
			}, 1000);
		}
	});
});

export { app, server, nextApp, launchArgs };
