/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,

	distDir: 'build/src',

	optimizeFonts: true,

	i18n: {
		locales: ['de_DE', 'en_GB', 'pt_BR'],
		defaultLocale: 'en_GB',
	},

	async rewrites() {
		return [
			{
				source: '/',
				destination: '/main',
			},
			{
				source: '/home',
				destination: '/main/home',
			},

			{
				source: '/register',
				destination: '/accounts/register',
			},
			{
				source: '/login',
				destination: '/accounts/login',
			},
		];
	},

	swcMinify: true,
};

module.exports = nextConfig;
