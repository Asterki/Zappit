const ms = require('ms');
const chalk = require('chalk');
const { cache } = requires('../config/databases');

module.exports = () => {
	setInterval(() => {
		cache.clear();
		console.log(chalk.magenta('event ') + '- Cache cleared');
	}, ms('1h'));
};
