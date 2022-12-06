interface User {
	userID: string;
	createdAt: number;

	username: string;
	displayName: string;
	avatar: string;

	following: {
		users: Array<string>;
		tags: Array<string>;
	};
	blocked: {
		users: Array<string>;
		tags: Array<string>;
	};

	email: {
		value: string;
		verified: boolean;
		verifiedAt: number;
	};

	preferences: {
		locale: 'en' | 'es' | 'de' | 'fr' | 'pr';
		theme: 'dark' | 'light';
	};

	password: string;
	userID: string;

	tfa: {
		secret: string;
		backupCodes: Array<string>;
	};

	banned: boolean;
}

interface UserData {
	userID: string;
}

interface SocketIOPayload {
	auth: {
		sessionID: string;
		username: string;
	}
	data: any
}

interface PrivateMessage {
	author: string;
	userID: string;
	sendToID: string;
	messageID: string;
	content: string;
	createdAt: number
}

declare global {
	namespace Express {
		interface Request {
			user: User;
		}
	}
}

export type { User, UserData, SocketIOPayload, PrivateMessage };
