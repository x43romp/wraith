import BotCommand from '../command'
import { Message, PartialMessage, ColorResolvable } from 'discord.js'
import BotMessage from '../message'

export default class WraithCommandTemplate extends BotCommand {
    protected _response: BotMessage
    protected _color: ColorResolvable = 0xffb8de;

    public async process(message: Message | PartialMessage): Promise<void> {
        super.process(message)

        this._response = new BotMessage(message.channel)
            .setAuthor('Wraith Bot')
            .setColor(this._color)
    }
}
