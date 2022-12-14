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

    tfa: {
        secret: string;
        backupCodes: Array<string>;
    };

    banned: boolean;
}

interface PrivateMessage {
    author: string;

    authorID: string;
    recipientID: string;

    messageID: string;

    content: string;
    createdAt: number
}

export type { User, PrivateMessage }