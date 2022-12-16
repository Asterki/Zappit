import express from 'express';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';

export const ApiError = (req: express.Request, res: express.Response, error: any): void => {
    mkdirp(path.join(__dirname, "../logs")).then(() => {
        const errorText = `New error reported at ${new Date()} in the ${req.url} route\n\n${error.stack}\n\n`

        fs.appendFile(path.join(__dirname, "../logs/errors.log"), errorText, (err) => {
            if (err) return console.log(err); // I swear to god if this ever happens
        });
    })
}