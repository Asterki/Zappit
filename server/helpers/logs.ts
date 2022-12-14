import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

const logError = (reportedError: any) => {
	const logFile = path.join(__dirname, '../logs/errors.log');

	fs.readFile(logFile, 'utf8', (err, data) => {
		if (err) throw err;

		fs.writeFile(path.join(__dirname, '../logs/errors.log'), `${data}\n\n${reportedError.stack}`, (err) => {
			if (err) throw err;
			console.log(`${chalk.redBright('error')} - New server error reported, please check logs`);
		});
	});
};

export { logError };
