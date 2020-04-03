import { PartialMessage, Message, User, Guild } from 'discord.js';
import WraithCommandTemplate from './wraith_template'
import WraithGame from '../db/game'
import WraithSquad from '../db/squad';

export default class SquadJoin extends WraithCommandTemplate {
    public async process(message: Message | PartialMessage): Promise<void> {
        super.process(message)
        message.delete()

        const clean = message.cleanContent.trim()
        const args = clean.split(' ')

        if (args.length < 2) {
            message.reply(`please provide the game and ign\n!join [game] [ign]`)
            return
        }
        const game = args[1]
        if (args.length < 3) {
            message.reply(`please provide ign\n!join ${game} [ign]`)
            return
        }
        const ign = args[2]

        const user: User = message.author
        const guild: Guild = message.guild

        const ws = new WraithSquad(guild, game)
        ws.join(user, ign)

        WraithSquad.displayGames(message, this._response)


    }

}
