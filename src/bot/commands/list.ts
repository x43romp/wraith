import WraithCommandTemplate from "./wraith_template";
import { Message, PartialMessage, EmbedFieldData, User, GuildMemberManager } from "discord.js";
import WraithSquad, { WraithSquadInterface } from "../db/squad";
import BotMessage from "../message";

export default class SquadList extends WraithCommandTemplate {

    public static TIMEOUT: number = 30000

    public async process(message: Message | PartialMessage): Promise<void> {
        super.process(message)

        message.delete()

        const clean = message.cleanContent.trim()
        const args = clean.split(' ')

        const guild = message.guild
        const user = message.author

        if (args.length < 2) {
            // const games = await new WraithSquad(guild).list()
            // const reply = await message.reply(`available games: ${games.join(', ')}`)
            // setTimeout(() => {
            //     reply.delete()
            // }, 5000);

            WraithSquad.displayGames(message, this._response)
            return

        }

        const game = args[1]


        const ws = new WraithSquad(guild, game)
        const data: WraithSquadInterface = await ws.listGame()

        const users: EmbedFieldData[] = []

        const reply: BotMessage = this._response
            .setText(`People who play ${game}`)
            .setTitle('Squad')
            .setFooter('Made by Wraith Squad system')

        const gm: GuildMemberManager = guild.members
        await data.users.forEach(async line => {
            await gm.fetch(line.userid).then(user => {
                const display = (user.nickname) ? user.nickname : user.user.username
                reply.addField(`@${display}`, line.ign.join(' | '), true)
            })
        })

        reply.send().then(msg => {
            message.delete({ timeout: 50, reason: 'cleaning commands' })
            msg.delete({ timeout: SquadList.TIMEOUT })

        })
    }
}
