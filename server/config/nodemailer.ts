// * In this file will be declared all the nodemailer clients
// * that will be used in the application.

import nodemailer from 'nodemailer';
import { config } from '../env';

const securityTransporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: '',
		pass: '',
	},
});

const accountsTransporter = nodemailer.createTransport({ ...config.emails.accounts });

export { securityTransporter, accountsTransporter };
