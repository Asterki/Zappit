import fs from 'fs';
import chalk from 'chalk';

const saveError: Function = (error: Error) => {
	fs.writeFile(`${__dirname}/../logs/errors.log`, `${error.stack}\n\n`, { flag: 'a' }, (err) => {
		if (err) throw err;
		console.log(chalk.red('error ') + '- Error saved in logs/errors.txt');
	});
};

export { saveError };
