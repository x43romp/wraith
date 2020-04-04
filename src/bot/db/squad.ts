import WraithConnection from './connection'
import { Guild, User, Message, GuildMemberManager, PartialMessage } from 'discord.js'
import { FilterQuery } from 'mongodb'
import BotMessage from '../message'

export interface WraithSquadInterface {
    guildID: string;
    game: string;
    users: WraithUserInterface[];
}

export interface WraithUserInterface {
    userid: string;
    ign: string[];
}

export default class WraithSquad extends WraithConnection {
    private _guild: string
    private _game: string

    constructor(guild: string | Guild, game?: string) {
        super('squad')

        this._guild = (typeof guild === 'string') ? guild : guild.id
        this._game = game
    }

    public static async displayGames(message: Message | PartialMessage, bot: BotMessage) {
        const ws = new WraithSquad(message.guild)
        // const games: WraithSquadInterface = await ws.list()
        const games: string[] = await ws.list()
        const gmm: GuildMemberManager = message.guild.members

        bot.setTitle('Squad')
            .setDescription(
                games.map(game => { return `- ${game}` }).join('\n')
            )

        await (await bot.send()).delete({ timeout: 10000 })

        // await games.users.forEach(async u => {
        //     await gmm.fetch(u.userid).then(user => {
        //         const display = (user.nickname) ? user.nickname : user.user.username
        //         bot.addField(display, u.ign.join(' | '), true)
        //     })
        // })
    }

    private filter(): FilterQuery<any> {
        const response: FilterQuery<any> = {
            guildID: this._guild,
            game: this._game
        }
        return response
    }

    public async list(): Promise<string[]> {
        const response: string[] = []

        await this.query({ guildID: this._guild }).then(data => {
            (data as any[]).forEach(data => {
                if (response.includes(data.game) === false)
                    response.push(data.game)
            })
        })

        return response
    }

    public async listGame(): Promise<WraithSquadInterface> {
        const response: WraithSquadInterface = { guildID: this._guild, game: this._game, users: [] }
        await this.query({ guildID: this._guild, game: this._game }).then(data => {
            (data as any[]).forEach(data => {
                response.users.push({
                    userid: data.userID,
                    ign: data.ign
                })
            })
        })
        return response
    }

    public async join(user: string | User, ign: string) {
        const userid = (typeof user === 'string') ? user : (user as User).id

        await this.updateOne(
            { guildID: this._guild, game: this._game, userID: userid },
            {
                $set: { dateUpdated: new Date().toISOString() },
                $setOnInsert: { dateCreated: new Date().toISOString() },
                $addToSet: { ign: ign }
            },
            { upsert: true }
        )
    }
}
