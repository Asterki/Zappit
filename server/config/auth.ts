import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import expressSession from "express-session";
import mongoStore from "connect-mongo";

import Users from "../models/user";
import { app } from "..";
import type { User } from "../types";
import { checkTFA } from "../utils/accounts";

// For authentication on each request
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

app.use(
    expressSession({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: true,
        store: mongoStore.create({
            mongoUrl: process.env.MONGODB_URI as string,
        }),
        name: "session",
        cookie: {
            secure: (process.env.COOKIE_SECURE as string) == "true",
            maxAge: parseInt(process.env.COOKIE_MAX_AGE as string) || 604800000,
            sameSite: true,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new passportLocal.Strategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
            session: true,
        },
        async (req: any, email: string, password: string, done: any) => {
            
            try {
                const user: User | null = await Users.findOne({ $or: [{ "email.value": req.body.emailOrUsername }, { "username": req.body.emailOrUsername },] });

                if (!user) return done(null, false, "invalid-credentials");
                if (!bcrypt.compareSync(password, user.password)) return done(null, false, "invalid-credentials");

                if (req.user.tfa.secret !== undefined) {
                    if (!req.body.tfaCode) return done(null, false, "missing-tfa-code");
                    if (typeof req.body.tfaCode !== "string") return done(null, false, "invalid-tfa-code");

                    const result = checkTFA(req.body.tfaCode, req.user);
                    if (result == false) return done(null, false, "invalid-tfa-code");
                }
                
                // TODO: Add the device to the users' logged in devices
                // TODO: Mail the user

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);
export {};
