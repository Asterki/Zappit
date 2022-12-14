import nodemailer from 'nodemailer';

const transporters = {
	security: nodemailer.createTransport({
		host: process.env.EMAIL_SECURITY_HOST as string,
		port: parseInt(process.env.EMAIL_SECURITY_PORT as string),
		secure: (process.env.EMAIL_SECURITY_SECURE as string) == 'true' ? true : false,
		auth: {
			user: process.env.EMAIL_SECURITY_USER as string,
			pass: process.env.EMAIL_SECURITY_PASS as string,
		},
	}),
};

const sendEmail = async (subject: string, html: string, to: string, transporter: 'security') => {
	await transporters[transporter].sendMail({
		from: `"Zappit"`,
		to: to,
		subject: subject,
		html: html,
	});
};

export { transporters, sendEmail };
