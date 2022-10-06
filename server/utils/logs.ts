import fs from "fs";
import path from "path";
import chalk from "chalk";

const logError = (error: any) => {
    fs.writeFile(path.join(__dirname, "../logs/errors.log"), `\n\n${error.stack}`, (err) => {
        if (err) throw err;
        console.log(`${chalk.redBright("error")} - New server error reported, please check logs`);
    });
};

export { logError };
