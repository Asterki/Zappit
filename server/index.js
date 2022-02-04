// General dependencies
const express = require('express');
const next = require('next');
const http = require('http');
const chalk = require('chalk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
	const app = express();

	require('./config/databases');
	require('./config/middleware')(app);
	require('./config/passport');
	require('./api/routes')(app);
	require('./controllers/controllers');

	app.all('*', (req, res) => {
		return handle(req, res);
	});

	const server = http.createServer(app);
	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log(chalk.magenta('event ') + '- Server listening on port ' + PORT);
	});
});
