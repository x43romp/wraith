import BotCommand from '../command'
import { Message, PartialMessage } from 'discord.js'
import BotMessage from '../message'
import WraithCommandTemplate from './wraith_template'

export default class HelloCommand extends WraithCommandTemplate {
    public async process(message: Message | PartialMessage): Promise<void> {
        super.process(message)
        this._response
            .setTitle('Hello')
            .setText('A response')

        this._response.send(message)
    }
}
