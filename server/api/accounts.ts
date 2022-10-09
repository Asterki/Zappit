import express from "express";
import rateLimit from "express-rate-limit";
import ms from "ms";
import validator from "validator";
import bcrypt from "bcrypt";
import passport from "passport";
import { v4 as uuidv4 } from "uuid";

import Users from "../models/user";
import { logError } from "../utils/logs";
import { User } from "../types";
import { checkTFA } from "../utils/accounts";

const router = express.Router();

declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}

// Account creation/deletion
router.post(
    "/register",
    rateLimit({
        windowMs: ms("12h"),
        max: 1,
        statusCode: 429,
        skipFailedRequests: true,
        skipSuccessfulRequests: false,
        message: "rate-limit",
    }),
    async (req: express.Request, res: express.Response) => {
        // Don't allow already logged in users to register a new account
        if (req.isAuthenticated() || req.user) return res.status(403).send("unauthorized");

        // If all arguments are there and are the right type
        let { username, email, password, displayName, locale } = req.body;
        if (!username || !email || !password || !displayName) return res.status(400).send("missing-parameters");
        if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string" || typeof displayName !== "string")
            return res.status(400).send("invalid-parameters");

        // Checks
        if (!locale) locale = "en";
        if (username.length < 3 || username.length > 14) return res.status(400).send("invalid-username");
        if (displayName.length > 24) return res.status(400).send("invalid-display-name");
        if (!validator.isEmail(email)) return res.status(400).send("invalid-email");
        if (password.length < 6 || password.length > 256) return res.status(400).send("invalid-password");

        try {
            // Find if the username is already registered
            let result = await Users.findOne({ $or: [{ "email.value": email.toLowerCase() }, { username: username.toLowerCase() }] });
            if (result) return res.status(400).send("err-username-or-email-taken");

            // Create the new user
            let user = new Users({
                username: username.toLowerCase(),
                email: {
                    value: email.toLowerCase(),
                    verified: false,
                },
                password: bcrypt.hashSync(password, 10),
                userID: uuidv4(),

                locale: locale,

                tfa: {
                    secret: "",
                    backupCodes: [],
                },
            });

            // Save the user to the database
            user.save((err: Error | null, result: User) => {
                if (err) throw err;

                req.logIn(result, (err: Error) => {
                    if (err) throw err;
                    return res.status(200).send("success");
                });
            });
        } catch (err) {
            logError(err);
            res.status(500).send("server-error");
        }
    }
);

router.post(
    "/delete-account",
    rateLimit({
        windowMs: ms("12h"),
        max: 1,
        statusCode: 429,
        skipFailedRequests: true,
        skipSuccessfulRequests: false,
        message: "rate-limit",
    }),
    async (req: express.Request, res: express.Response) => {
        // Block not logged in users
        if (!req.isAuthenticated() || !req.user) return res.status(403).send("unauthorized");

        let { password } = req.body;
        if (!password) return res.status(400).send("missing-parameters");
        if (typeof password !== "string") return res.status(400).send("invalid-parameters");

        try {
            // If user haves tfa activated, verify it
            if (req.user.tfa.secret !== "") {
                if (!req.body.tfaCode) return res.status(400).send("missing-parameters");
                if (typeof req.body.tfaCode !== "string") return res.status(400).send("invalid-parameters");

                let result = checkTFA(req.body.tfaCode, req.user);
                if (result == false) return res.status(403).send("unauthorized");
            }

            // Delete from database
            await Users.deleteOne({ userID: req.body.userID });

            // Logout the user
            req.logout((err: any) => {
                if (err) throw err;
                return res.status(200).send("success");
            });
        } catch (err) {
            logError(err);
            res.status(500).send("server-error");
        }
    }
);

// Account access
router.post(
    "/login",
    rateLimit({
        windowMs: ms("1h"),
        max: 10,
        statusCode: 429,
        message: "rate-limit",
    }),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) return res.status(400).send("missing-parameters");
        if (typeof emailOrUsername !== "string" || typeof password !== "string") return res.status(400).send("invalid-parameters");

        try {
            passport.authenticate("local", (err: Error | null, user: User, result: string) => {
                if (err) throw err;
                if (!user) return res.status(200).send(result);

                // Login the user
                req.logIn(user, (err) => {
                    if (err) throw err;
                    return res.status(200).send("success");
                });
            })(req, res, next);
        } catch (err) {
            logError(err);
            res.status(500).send("server-error");
        }
    }
);

router.get("/logout", (req: express.Request, res: express.Response) => {
    if (!req.isAuthenticated()) return res.redirect("/");

    try {
        req.logout((err: any) => {
            if (err) throw err;
            res.redirect("/");
        });
    } catch (err) {
        logError(err);
        res.status(500).send("server-error");
    }
});

module.exports = router;
