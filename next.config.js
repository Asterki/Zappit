const rewritesFile = require('./server/config/rewrites.js');

module.exports = {
    reactStrictMode: false,
    webpack5: true,

    async rewrites() {
        return rewritesFile();
    },

    resolve: {
        extensions: ['.js', '.jsx'],
    },
};
