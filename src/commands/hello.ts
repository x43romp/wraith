import BotCommand from "../command";
import { Message, PartialMessage } from "discord.js"

export default class HelloCommand extends BotCommand {
    constructor(command: string) {
        super(command);
    }

    public process(message: Message | PartialMessage): void {
        console.log('Hello');
    }
}
