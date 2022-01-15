// * Here will be the configuration for the mongoose client

const mongoose = require('mongoose');
const redis = require('redis');

const redisClient = redis.createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().then(() => console.log('Redis Client Connected'));

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
const mongooseClient = mongoose.connection;
mongooseClient.once('open', () => console.log('MongoDB database connection established successfully'));

module.exports = { redisClient, mongooseClient };
