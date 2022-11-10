import express from 'express';
import path from 'path';

import { expressSharp, FsAdapter } from 'express-sharp';
import { app } from '../';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const subdomain = require('express-subdomain'); // Because there aren't types for this library

const router = express.Router();

router.use(
	'/avatars',
	expressSharp({
		imageAdapter: new FsAdapter(path.join(__dirname, '../../data/avatars')),
	})
);

router.get('/', (req, res) => {
	res.send('jqqwioeuqwioejhqweui');
});

app.use(subdomain('cdn', router));
