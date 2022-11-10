import express from 'express';
import next from 'next';
import http from 'http';
import socketIO from 'socket.io';

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

const nextApp = next({ dev: launchArgs.dev });
const io = new socketIO.Server(server);

nextApp.prepare().then(() => {
	const handle = nextApp.getRequestHandler();

	require('./config/middleware');
	require('./config/auth');
	require('./config/databases');
	require('./config/controllers');
	require('./config/routes');
	require('./config/cdn');
	
	require("./sockets/index")
	
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

export { app, server, nextApp, io, launchArgs };
