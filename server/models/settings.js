const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Settings = new Schema({
	userID: {
		type: String,
		required: true,
		unique: true,
	},
	security: {
		xfa: {
			enabled: {
				type: Boolean,
				default: false,
			},
			recoveryCodes: {
				type: Array,
				default: [], // [{ code: String, expired: Boolean }]
			},
		},
	},
	privacy: {
		blocked: {
			users: {
				type: Array,
				default: [], // [{ userID: String, createdAt: Date }]
			},
			words: {
				type: Array,
				default: [], // [{ word: String, createdAt: Date }]
			},
			tags: {
				type: Array,
				default: [], // [{ tag: String, createdAt: Date }]
			},
		},
		dmsFrom: {
			type: String,
			default: 'all', // 'all', 'none' or 'followers'
		},
	},
	notifications: {
		mentions: {
			type: String,
			default: 'push',
		},
		messages: {
			type: String,
			default: 'push',
		},
		followRequest: {
			type: String,
			default: 'email',
		},
		security: {
			type: String,
			default: 'email',
		},
	},
	accessibility: {
		language: {
			type: String,
		},
		theme: {
			type: String,
			default: 'dark',
		},
	},
});

module.exports = mongoose.model('Settings', Settings, 'Settings');
