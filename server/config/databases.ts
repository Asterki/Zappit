// * Here will be the configuration for the mongoose client

import mongoose from 'mongoose';
import level from 'level';
import path from 'path';
import chalk from 'chalk';

import { config } from '../../env';

const cache = level(path.join(__dirname, '../../data/db/cache'));
const levelDB = level(path.join(__dirname, '../../data/db/levelDB'));

mongoose.connect(config.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true } as mongoose.ConnectOptions);
const mongooseClient = mongoose.connection;

mongooseClient.once('open', () => {
	console.log(chalk.magenta('event ') + '- Databases connected');
});

export { cache, levelDB, mongooseClient };
