// * Here will be the configuration for the mongoose client

const mongoose = require('mongoose');
const level = require('level');
const path = require('path');
const chalk = require('chalk');

const cache = level(path.join(__dirname, '../../data/db/cache'));
const levelDB = level(path.join(__dirname, '../../data/db/levelDB'));

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
const mongooseClient = mongoose.connection;
mongooseClient.once('open', () => {
	console.log(chalk.magenta('event ') + '- Databases connected');
});

module.exports = { cache, levelDB, mongooseClient };
