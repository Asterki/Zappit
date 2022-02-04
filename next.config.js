module.exports = {
    reactStrictMode: false,
    webpack5: true,

    async rewrites() {
        return [
            // * Main Category
            {
                source: '/',
                destination: '/main',
            },
            {
                source: '/home',
                destination: '/main',
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
        ];
    },

    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
