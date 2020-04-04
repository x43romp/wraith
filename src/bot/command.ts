import { Message, PartialMessage } from 'discord.js'

export default class BotCommand {
    public _command: string;

    constructor(command: string) {
        this._command = command
    }

    public isValid(message: string): boolean {
        const args = message.split(' ')
        if (args[0] === this._command)
            return true
        else
            return false
    }

    public process(message: Message | PartialMessage): void {
        console.log(`command ${this._command} processing`)
    }
}
