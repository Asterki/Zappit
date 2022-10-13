/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from 'chalk';
import { app } from '../';

try {
	app.use('/api/accounts', require('../api/accounts'));
	console.log(`${chalk.magenta('event')} - Routes loaded`);
} catch (err: any) {
	console.log(`${chalk.redBright('error ')} - There was an error loading the routes`);
	console.log(err);
}
