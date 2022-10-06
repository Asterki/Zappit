import express from "express";
import next from "next";
import http from "http";
import socketIO from "socket.io";

import minimist from "minimist";
import chalk from "chalk";

require("dotenv").config({});

const launchArgs = minimist(process.argv.slice(2), {
    string: ["port"],
    boolean: ["dev"],

    default: {
        dev: true,
        port: 8080,
    },
});

const app = express();
const server = http.createServer(app);
const nextApp = next({ dev: launchArgs.dev });
const io = new socketIO.Server(server);

nextApp.prepare().then(() => {
    const handle = nextApp.getRequestHandler();

    require("./config/middleware");
    require("./config/auth");
    require("./config/databases");
    require("./config/routes");

    // Handle next.js routing
    app.get("*", (req: express.Request, res: express.Response) => {
        handle(req, res);
    });

    // Start the server
    server.listen(launchArgs.port, () => {
        console.log(`${chalk.magenta("event")} - Server running in ${launchArgs.dev == true ? "development" : "production"} mode at ${launchArgs.port}`);
    });
});

export { app, server, nextApp, io, launchArgs };
