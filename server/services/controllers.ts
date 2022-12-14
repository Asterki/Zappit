import ms from 'ms';
import fs from 'fs';

// import Users from '../models/user';
import { redisClient } from './databases';

// // Account field checking cache
// setInterval(async () => {
// 	const userList = await Users.find({}, { username: 1, email: 1, _id: 0 });

// 	const usernamesArray = userList.map((user) => {
// 		return user.username;
// 	});

// 	const emailsArray = userList.map((user) => {
// 		return user.email.value;
// 	});

// 	await redisClient.set('checks-usernames', JSON.stringify(usernamesArray));
// 	await redisClient.set('checks-emails', JSON.stringify(emailsArray));
// }, ms('10s'));

// // Messages cache
// setInterval(async () => {
// 	let messages = await redisClient.get('cached-messages');
// 	if (messages == null) return;
// 	messages = JSON.parse(messages);

// 	// Store the new messages to the database
// }, ms('10s'));

// Files
setInterval(async () => {
	const filesRaw = await redisClient.get('marked-for-deletion');
	if (filesRaw == null) return;

	const files = JSON.parse(filesRaw);

	for (let index = 0; index < files.length; index++) {
		const file = files[index];

		fs.unlink(file, (err: any) => {
			if (err) throw err;
		});
	}

	await redisClient.set('marked-for-deletion', '[]');
}, ms('1m'));
