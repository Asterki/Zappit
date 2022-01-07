const express = require('express');
const next = require('next');
const http = require('http');
const cookieParser = require('cookie-parser');
const path = require('path');
const chalk = require('chalk');
const morgan = require('morgan');
const compression = require('compression');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../public')));
    app.use('/assets', express.static(path.join(__dirname, '../src/assets')));
    app.disable('x-powered-by');
    app.use(cookieParser());
    app.use(compression());
    // app.use(morgan("tiny"));

    require('./api/index')(app);
    app.all('*', (req, res) => {
        return handle(req, res);
    });

    const server = http.createServer(app);

    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(chalk.green.bold(`> Ready on http://localhost:${PORT}`));
    });
});
