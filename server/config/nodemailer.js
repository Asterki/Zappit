// * In this file will be declared all the nodemailer clients
// * that will be used in the application.

const nodemailer = require('nodemailer');

const securityTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: '',
        pass: '',
    },
});

const accountsTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'asterki.dev@gmail.com',
        pass: 'cjcukmrhbovrizyx',
    },
});

module.exports = { securityTransporter, accountsTransporter };
