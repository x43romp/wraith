import BotCommand from "../command";
import { Message, PartialMessage, TextChannel, DMChannel } from 'discord.js';
import BotMessage from "../message";

export default class ClearCommand extends BotCommand {

    public async process(message: Message | PartialMessage): Promise<void> {
        // get limit size
        const args = message.cleanContent.split(' ');
        const limitCount: number = (args[1] && isNaN(parseInt(args[1])) == false) ?
            parseInt(args[1]) : 10;

        // fetch messages
        const channel: TextChannel | DMChannel = message.channel;
        const messages = channel.messages.fetch({ limit: limitCount });

        // create reply message
        const replyBuilder: BotMessage = new BotMessage(message.channel)
            .setText(`Removing ${(await messages).size} messages`)
            .setTitle(`clearing...`)
            .setFooter(`this message will dissapear once the task is done`);
        const reply: Message = await replyBuilder.send();

        (await messages).array().forEach((msg) => {
            console.log('delete prep');
            msg.delete();
            console.log('delete done');
        })

        reply.delete();

    }
}
