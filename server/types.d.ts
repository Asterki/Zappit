import express from "express";

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

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

export type { User };
