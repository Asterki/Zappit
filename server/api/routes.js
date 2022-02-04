const chalk = require('chalk');

module.exports = (app) => {
	app.use('/api/private/pages/', require('./private/pages'));
	app.use('/api/private/accounts/', require('./private/accounts'));
	app.use('/api/private/checks/', require('./private/checks'));
	app.use('/api/private/emails/', require('./private/emails'));

	console.log(chalk.cyan('info  ') + '- Routes loaded');
};
