import BotCommand from "../command";
import { Message, PartialMessage } from "discord.js"
import BotMessage from "../message";

export default class HelloCommand extends BotCommand {
    constructor(command: string) {
        super(command);
    }

    public async process(message: Message | PartialMessage): Promise<void> {
        const msg = new BotMessage(message.channel);
        // EMBEDED - TITLE / Response
        msg.setText("A response").setTitle("Title").send();
    }
}
