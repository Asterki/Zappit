// * In this file will be declared all the nodemailer clients
// * that will be used in the application.

const nodemailer = require('nodemailer');

const security = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: '',
        pass: '',
    },
});

module.exports = { security };
