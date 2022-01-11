// * Here will be the configuration for the mongoose client

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;
connection.once('open', function () {
    console.log('MongoDB database connection established successfully');
});


module.exports = connection;