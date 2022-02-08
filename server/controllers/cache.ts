import ms from 'ms';
import chalk from 'chalk';
import { cache } from '../config/databases';

module.exports = () => {
	setInterval(() => {
		cache.clear();
		console.log(chalk.magenta('event ') + '- Cache cleared');
	}, ms('1h'));
};
