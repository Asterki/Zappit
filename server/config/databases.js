// * Here will be the configuration for the mongoose client

const mongoose = require('mongoose');
const level = require('level');

const db = level('my-db')

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
const mongooseClient = mongoose.connection;
mongooseClient.once('open', () => console.log('MongoDB database connection established successfully'));

module.exports = { db, mongooseClient };
