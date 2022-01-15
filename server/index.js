// General dependencies
const express = require('express');
const next = require('next');
const http = require('http');
const chalk = require('chalk');
const path = require('path');

const PORT = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

require('dotenv').config({ path: path.join(__dirname, '../.env') });

nextApp.prepare().then(() => {
	const app = express();
	
	require('./config/databases');
	require('./config/middleware')(app);
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
