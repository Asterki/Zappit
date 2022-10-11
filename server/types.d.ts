interface User {
    username: string;
    email: {
        value: string;
        verified: boolean;
    };
    password: string;
    userID: string;

    locale: string;

    tfa: {
        secret: string;
        backupCodes: Array<string>;
    };
}

interface UserData {
    userID: string
}

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

export type { User, UserData };
