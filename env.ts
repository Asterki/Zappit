export const config = {
	PORT: 8080,
	HOST: 'http://localhost:8080',

	MONGODB_URI: 'mongodb://localhost:27017/test',
	NODE_ENV: 'development',

	SESSION_SECRET: '4j9D9Gb7!FT%?kak*7!B!UQaNDk53h97#',
	RECAPTCHA_SECRET: '6LfmhCceAAAAALQod9vDOWx0EkHKCzNB6i6yhUjZ',

	emails: {
		accounts: {
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: 'asterki.dev@gmail.com',
				pass: 'cjcukmrhbovrizyx',
			},
		},
	},
};
