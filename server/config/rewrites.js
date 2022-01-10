module.exports = () => {
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
};
