import { Client } from 'discord.js';
import * as env from 'dotenv';
import { BotConfig } from './api';
import Bot from './bot';

// configure environment
env.config();
const TOKEN = process.env.DISCORD_TOKEN;

// configure bot
const configData = require("./bot.json");
let config: BotConfig = {
    token: TOKEN,
    ... configData
}

console.log(config);

new Bot(config).start();
