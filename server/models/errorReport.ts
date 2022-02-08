const mongoose = require('mongoose');

const errorReports = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
        },
        at: {
            type: Date,
            required: true,
        },
        stack: {
            type: Object,
            required: true,
        },
        id: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        collection: 'errorReports',
    }
);

module.exports = mongoose.model('errorReports', errorReports);
export {}
