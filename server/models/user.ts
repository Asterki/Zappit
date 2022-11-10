import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = mongoose.Schema;

const User = new Schema({
	userID: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Number,
		required: true,
	},

	username: {
		type: String,
		required: true,
		unique: true,
	},
	displayName: {
		type: String,
		required: false,
	},
	avatar: {
		type: String,
		required: false,
		default: '',
	},

	following: {
		users: {
			type: Array,
			required: false,
			unique: false,
		},
		tags: {
			type: Array,
			required: false,
			unique: false,
		},
	},

	blocked: {
		users: {
			type: Array,
			required: false,
			unique: false,
		},
		tags: {
			type: Array,
			required: false,
			unique: false,
		},
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

	preferences: {
		locale: {
			type: String,
			required: false,
			default: 'en',
		},
		theme: {
			type: String,
			required: false,
			default: 'dark',
		},
	},

	password: {
		type: String,
		required: true,
	},

	tfa: {
		secret: {
			type: String,
			required: false,
			default: '',
		},
		backupCodes: {
			type: Array,
			required: false,
			default: [],
		},
	},

	banned: {
		type: Boolean,
		required: false,
		default: false,
	},
});

User.plugin(passportLocalMongoose);

export default mongoose.model('User', User, 'users');
