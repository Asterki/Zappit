import mongoose from "mongoose";
import chalk from "chalk";
import * as redis from "redis";

// Create redis client, and connect
const redisClient = redis.createClient({
    url: process.env.REDIS_URI as string,
});

(async () => {
    await redisClient.connect();
})();

// Events for the redis client
redisClient.on("ready", () => {
    console.log(`${chalk.magenta("event")} - Redis database connected`);
});

redisClient.on("error", (error: Error) => {
    console.log(`${chalk.redBright("error")} - There was an error with the redis client`);
    console.log(error);
});

// Connect to mongodb
mongoose.connect(process.env.MONGODB_URI as string, { useUnifiedTopology: true, useNewUrlParser: true } as mongoose.ConnectOptions);
const mongooseClient = mongoose.connection;

// Events for the mongoose client
mongooseClient.once("open", () => {
    console.log(`${chalk.magenta("event")} - MongoDB database connected`);
});

mongooseClient.once("error", (error: Error) => {
    console.log(`${chalk.redBright("error")} - There was an error with the mongoose client`);
    console.log(error);
});

export { mongooseClient };
