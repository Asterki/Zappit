const express = require('express');
const next = require('next');
const http = require('http');
const cookieParser = require('cookie-parser');
const path = require('path');
const chalk = require('chalk');
const morgan = require('morgan');
const helmet = require('helmet');
const { errorReporter } = require('express-youch');
const compression = require('compression');
const favicon = require('serve-favicon');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '../public')));

    app.disable('x-powered-by');
    app.use('/assets', express.static(path.join(__dirname, '../src/assets')));
    app.use(favicon(path.join(__dirname, '../public/favicon.ico')));

    app.use(cookieParser());
    app.use(errorReporter());
    app.use(compression());
    if (dev == false) app.use(helmet());

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
