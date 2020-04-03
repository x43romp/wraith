import * as env from 'dotenv'
import Bot from './bot'
import { BotConfig } from './api'

// configure environment
env.config()
const TOKEN = process.env.DISCORD_TOKEN

// configure bot
const configData = require('./bot.json')
const config: BotConfig = {
    token: TOKEN,
    ...configData
}

console.log(config)

new Bot(config).start()
