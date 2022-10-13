import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserData = new Schema({
	userID: {
		type: String,
		required: true,
		unique: true,
	},
});

export default mongoose.model('UserData', UserData, 'user data');
