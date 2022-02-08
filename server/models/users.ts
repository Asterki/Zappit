const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		value: {
			type: String,
			required: true,
			unique: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		verifiedAt: {
			type: Date,
			default: null,
		},
	},
	userID: {
		type: String,
		required: true,
		unique: true,
	},
	profile: {
		private: {
			type: Boolean,
			default: true,
		},
		birthDate: {
			type: Date,
			default: null,
		},
		bio: {
			type: String,
			default: '',
		},
		avatar: {
			type: String,
			default: '',
		},
		location: {
			type: String,
			default: '',
		},
	},
	accountInfo: {
		createdAt: {
			type: Date,
			default: Date.now,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		authorizedLoginZones: {
			type: Array,
			default: [], // [{ zone: String, createdAt: Date }]
		},
		authorizedApps: {
			type: Array,
			default: [], // [{ appID: String, permissions: Array }]
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		banned: {
			type: Boolean,
			default: false,
		},
	},
});

User.plugin(passportLocalMongoose);

export default mongoose.model('User', User, 'users');
