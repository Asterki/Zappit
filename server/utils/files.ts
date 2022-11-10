import fs from 'fs';

import { redisClient } from '../config/databases';

const markForDeletion = async (fileRoute: string) => {
	if (fs.existsSync(fileRoute)) {
		let currentValueRaw = await redisClient.get('marked-for-deletion');
		if (currentValueRaw == null) currentValueRaw = '[]';

		const currentValue = JSON.parse(currentValueRaw as string);
		currentValue.push(fileRoute);

		await redisClient.set('marked-for-deletion', JSON.stringify(currentValue));
	} else return 'file-does-not-exists';
};

export { markForDeletion };
