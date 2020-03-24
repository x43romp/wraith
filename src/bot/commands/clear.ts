import BotCommand from "../command";
import { Message, PartialMessage, TextChannel, DMChannel } from 'discord.js';
import BotMessage from "../message";
import WraithCommandTemplate from "./wraith_template";

export default class ClearCommand extends WraithCommandTemplate {

    public async process(message: Message | PartialMessage): Promise<void> {
        super.process(message);

        // get limit size
        const args = message.cleanContent.split(' ');
        const limitCount: number = (args[1] && isNaN(parseInt(args[1])) == false) ?
            parseInt(args[1]) : 10;

        // fetch messages
        const channel: TextChannel | DMChannel = message.channel;
        const messages = channel.messages.fetch({ limit: limitCount });

        // create reply message
        const replyBuilder: BotMessage = this._response
            .setText(`Removing ${(await messages).size} messages`)
            .setTitle(`clearing...`)
            .setFooter(`this message will dissapear once the task is done`);
        const reply: Message = await replyBuilder.send();

        (await messages).array().forEach((msg) => {
            msg.delete();
        })

        reply.delete();

    }
}
