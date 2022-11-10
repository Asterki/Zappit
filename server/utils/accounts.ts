import speakeasy from 'speakeasy';
import bcrypt from 'bcrypt';

import Users from '../models/user';
import type { User } from '../../types';

const checkTFA = (code: string, user: User) => {
	if (code.length == 6) {
		const verified = speakeasy.totp.verify({
			secret: user.tfa.secret,
			encoding: 'base32',
			token: code,
		});

		return verified;
	} else {
		let backupCodeVerified = false;

		user.tfa.backupCodes.forEach((backupCode: string, index: number) => {
			if (backupCode == null) return;
			if (!bcrypt.compareSync(code, backupCode)) return;

			backupCodeVerified = true;

			// Remove the code
			delete user.tfa.backupCodes[index];
			Users.updateOne({ 'email.value': user.userID }, { tfa: user.tfa });
		});

		return backupCodeVerified;
	}
};

export { checkTFA };
