import * as env from 'dotenv'
import Bot from './bot'
import { BotConfig } from './api'

import WraithConnection from './db/connection'
import WraithGame from './db/game'
import WraithClient from '../Wraith/client'

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
console.log('mongodb connection: ', WraithClient.connectionString())

new Bot(config).start()
