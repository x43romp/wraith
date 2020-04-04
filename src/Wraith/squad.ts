import WraithClient from './client'
import { Guild, User } from 'discord.js'

export interface WraithSquadMember {
    userID: string,
    ign: string[]
}

export default class WraithSquad extends WraithClient {
    public static COLLECTION: string = 'squad'
    private _gid: string

    constructor(guild: string | Guild) {
        super(WraithSquad.COLLECTION)
        this._gid = (typeof guild === 'string') ? guild : (guild as Guild).id
    }

    public async squads() {
        const client = await this.connect()
        const squads: any[] = await client
            .find({ guildID: this._gid })
            .toArray()
        const response: string[] = []
        squads.map(squad => {
            if (response.includes(squad.squad) === false)
                response.push(squad.squad)
        })
        return response
    }

    public async squad(squad: string): Promise<WraithSquadMember[]> {
        const client = await this.connect()
        squad = squad.trim()
        const response: WraithSquadMember[] = []
        const players: any[] = await client
            .find({ guildID: this._gid, squad: `${squad.toLowerCase()}` })
            .toArray()

        players.forEach(player => {
            response.push({ userID: player.userID, ign: player.ign })
        })

        return response
    }

    public async join(squad: string, user: string | User, ign: string) {
        const uid = (typeof user === 'string') ? user : (user as User).id
        const client = await this.connect()
        const date = new Date().toISOString()

        return await client.updateOne(
            { guildID: this._gid, squad: squad.toLowerCase(), userID: uid },
            {
                $set: { dateUpdate: date },
                $setOnInsert: { dateCreate: date },
                $addToSet: { ign: ign }
            },
            { upsert: true }
        ).then(value => { console.log('squad join', value) })
    }
}
