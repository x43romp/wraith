import { BotConfig } from './api'
import { Client } from 'discord.js'
import BotCommand from './command'

export default class Bot {
    private _client: Client;
    private _commands: BotCommand[]
    private _commandList: string[]
    private _config: BotConfig;

    constructor(config: BotConfig) {
        this._config = config
        if (!config.token) throw new Error('No token available')

        this._client = new Client()
    }

    private loadConfig(commandDir: string): void {
        console.log('bot', `loadConfig(${commandDir})`)

        // check if
        if (!this._config.commands ||
            this._config.commands.length === 0 ||
            Array.isArray(this._config.commands) === false)
            throw new Error('No available commands in config')

        // initialize commands
        this._commands = []
        this._commandList = []

        // get prefix

        // load commands
        this._config.commands.forEach(command => {
            const commandPrefix = (this._config.prefix) ? this._config.prefix : ''
            const commandLine = `${commandPrefix}${command}`

            const commandPath: string = `${commandDir}/${command}`
            const CommandClass = require(commandPath).default

            const cmd = new CommandClass(commandLine) as BotCommand
            this._commands.push(cmd)
            this._commandList.push(commandLine)

            console.log('bot', `command loaded: ${command}`)
        })
    }

    start(commandDir: string = `${__dirname}/commands`): void {
        console.log('bot', `start(${commandDir})`)

        this.loadConfig(commandDir)
        this._client.login(this._config.token)

        this._client.on('ready', () => {
            console.log('client', 'started')
        })

        this._client.on('message', message => {
            console.log(`message ${message.author.username} ${message.cleanContent}`)
            if (message.author.bot) return

            const args: string[] = message.cleanContent.split(' ')
            if (this._commandList.indexOf(args[0]) < 0) return false

            for (const cmd of this._commands)
                if (cmd.isValid(message.cleanContent))
                    cmd.process(message)
        })
    }
}
