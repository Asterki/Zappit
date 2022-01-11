// General dependencies
const express = require('express');
const next = require('next');
const http = require('http');
const chalk = require('chalk');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
	const app = express();

	require('./config/middleware')(app);
	require('./config/mongoose');
	require('./config/passport');
	require('./api/routes')(app);

	app.all('*', (req, res) => {
		return handle(req, res);
	});

	const server = http.createServer(app);
	server.listen(PORT, (err) => {
		if (err) throw err;
		console.log(chalk.green.bold(`> Ready on http://localhost:${PORT}`));
	});
});
