import ms from 'ms';
import Users from '../models/user';

import { redisClient } from './databases';

// Account field checking cache
setInterval(async () => {
	const userList = await Users.find({}, { username: 1, email: 1, _id: 0 });

	const usernamesArray = userList.map((user) => {
		return user.username;
	});

	const emailsArray = userList.map((user) => {
		return user.email.value;
	});

	await redisClient.set('checks-usernames', JSON.stringify(usernamesArray));
	await redisClient.set('checks-emails', JSON.stringify(emailsArray));
}, ms('10s'));

// Messages cache
setInterval(async () => {
	let messages = await redisClient.get('cached-messages');
	if (messages == null) return;
	messages = JSON.parse(messages);

	// Store the new messages to the database
}, ms('10s'));
