import express from 'express';
import { z } from 'zod';

import { logError } from '../utils/logs';

import Users from '../models/user';
import { redisClient } from '../config/databases';

import type { User } from '../../types';

const router = express.Router();

router.post('/get-contacts', async (req: express.Request, res: express.Response) => {
	if (!req.isAuthenticated()) return res.status(403).send('unauthenticated');

	try {
		const cachedContacts = await redisClient.get(`${req.user.userID}-cached-contacts`);

		if (cachedContacts == null) {
			const result: Array<User> | null = await Users.find({ userID: { $in: req.user.following.users } });
			const contacts = [];

			for (let i = 0; i < result.length; i++) {
				const user = result[i];
				contacts.push({ username: user.username, displayName: user.displayName, userID: user.userID, avatar: user.avatar });
			}

			redisClient.set(`${req.user.userID}-cached-contacts`, JSON.stringify(contacts));

			return res.send(contacts);
		}

		return res.send(JSON.parse(cachedContacts));
	} catch (err) {
		logError(err);
		return res.status(500).send('server-error');
	}
});

router.post('/follow-user', async (req: express.Request, res: express.Response) => {
	if (!req.isAuthenticated()) return res.status(403).send('unauthorized');

	const bodyScheme = z.object({
		username: z.string()
	}).required()

	const parsedBody = bodyScheme.safeParse(req.body)
	if (!parsedBody.success) return res.status(400).send('invalid-parameters');

	try {
		// Find the searched user
		const userFound: User | null = await Users.findOne({ username: parsedBody.data.username });
		if (!userFound) return res.status(400).send('invalid-parameters');

		// Push the new user to the user's contact list
		const currentContactList: Array<string> = req.user.following.users;
		if (currentContactList.includes(userFound.userID)) return res.status(400).send('invalid-parameters');
		currentContactList.push(userFound.userID);

		// Update in the cache and in the database
		await Users.updateOne({ userID: req.user.userID }, { 'following.users': currentContactList });
		await redisClient.del(`${req.user.userID}-cached-contacts`);

		return res.send('ok');
	} catch (err) {
		logError(err);
		return res.status(500).send('server-error');
	}
});

router.post('/unfollow-user', async (req: express.Request, res: express.Response) => {
	if (!req.isAuthenticated()) return res.status(403).send('unauthorized');

	const bodyScheme = z.object({
		username: z.string()
	}).required()

	const parsedBody = bodyScheme.safeParse(req.body)
	if (!parsedBody.success) return res.status(400).send('invalid-parameters');

	try {
		const userFound: User | null = await Users.findOne({ username: parsedBody.data.username });
		if (!userFound) return res.status(400).send('invalid-parameters');

		// Filter out the user
		const newContactList: Array<string> = [];
		for (let i = 0; i < req.user.following.users.length; i++) {
			const userID = req.user.following.users[i];
			if (userID !== userFound.userID) newContactList.push(userID)
		}

		// Update in the cache and in the database
		Users.updateOne({ userID: req.user.userID }, { 'following.users': newContactList });
		redisClient.del(`${req.user.userID}-cached-contacts`);

		return res.send('ok');
	} catch (err) {
		logError(err);
		return res.status(500).send('server-error');
	}
});

module.exports = router;
