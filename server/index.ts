// General dependencies
import express from 'express';
import next from 'next';
import http from 'http';
import chalk from 'chalk';

import { config } from '../env';

const PORT = config.PORT || 8080;
const dev = config.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
	const app = express();

	require('./config/databases');
	require('./config/middleware')(app);
	require('./config/passport');
	require('./api/routes')(app);
	require('./controllers/controllers');

	app.all('*', (req: express.Request, res: express.Response) => {
		return handle(req, res);
	});

	const server: http.Server = http.createServer(app);

	server.listen(PORT, () => {
		console.log(chalk.magenta('event ') + '- Server listening on port ' + PORT);
	});
});

export {};
