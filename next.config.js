module.exports = {
	reactStrictMode: false,
	webpack5: true,
	
	images: {
    		loader: 'custom',
  	},

	async rewrites() {
		return [
			// * Main Category
			{
				source: '/',
				destination: '/main',
			},
			{
				source: '/home',
				destination: '/main/home',
			},

			// * Accounts Category
			{
				source: '/login',
				destination: '/accounts/login',
			},
			{
				source: '/register',
				destination: '/accounts/register',
			},
			{
				source: '/logout',
				destination: '/accounts/logout',
			},
			{
				source: '/password-recovery',
				destination: '/accounts/password-recovery',
			},
			{
				source: '/verify-email',
				destination: '/accounts/verify-email',
			},
		];
	},

	resolve: {
		extensions: ['.js', '.jsx'],
	},
};
