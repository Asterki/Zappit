/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,

	distDir: 'build/src',

	optimizeFonts: true,

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
