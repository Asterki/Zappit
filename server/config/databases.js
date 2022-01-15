// * Here will be the configuration for the mongoose client

const mongoose = require('mongoose');
const redis = require('redis');

(async () => {
	const client = redis.createClient();

	client.on('error', (err) => console.log('Redis Client Error', err));

	await client.connect().then(()  => [
        console.log('Redis Client Connected'),
    ])
})();

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;
connection.once('open', function () {
	console.log('MongoDB database connection established successfully');
});

module.exports = connection;
