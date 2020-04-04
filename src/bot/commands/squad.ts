import WraithCommandTemplate from './wraith_template'
import { Message, PartialMessage, UserManager, Guild } from 'discord.js'
import WraithSquad from '../../Wraith/squad'

export default class SquadBot extends WraithCommandTemplate {
    private _client: WraithSquad
    private _timeout: number = 60000 * 5

    public async process(message: Message | PartialMessage): Promise<void> {
        super.process(message)

        console.log('squad')

        const clean = message.cleanContent.trim()
        const args = clean.split(' ')

        message.delete()

        const guild = message.guild
        const user = message.author

        this._client = new WraithSquad(guild)

        if (!args[1]) return this.printHelp()
        const command = args[1].toLowerCase()
        const squad = args[2]

        const temp: string[] = []
        for (let i = 3; i < args.length; i++)
            temp.push(args[i])

        const ign = temp.join(' ').trim()

        if (command === 'join') {
            if (!squad || !ign) return this.printHelp()
            this._client.join(squad, user, ign)
            await setTimeout(() => { this.listSquad(guild, squad) }, 1000)
        }

        if (command === 'list' && !squad)
            this.list()
        else if (command === 'list' && squad)
            this.listSquad(guild, squad)
    }

    private async list() {
        const squads: string[] = await this._client.squads()
        console.log(squads)
        const msg = await this._response
            .setTitle('Available Squads'.toUpperCase())
            .setText(squads.map(squad => { return `- ${squad}` }).join('\n'))
            .send()

        msg.delete({ timeout: this._timeout })
    }

    private async listSquad(guild: Guild, squad) {
        const members = await this._client.squad(squad.toLowerCase())
        const manager = guild.members
        this._response
            .setTitle(`${squad} PLAYERS`.toUpperCase())
            .setDescription(`${members.length} players`)

        await members.forEach(async member => {
            const guildMember = await manager.fetch(member.userID)
            const username = (guildMember.nickname) ? guildMember.nickname : guildMember.user.username
            this._response.addField(username, member.ign.join(' | '), true)
        })

        const msg = await this._response.send()
        msg.delete({ timeout: this._timeout })
    }

    private async printHelp() {
        const usage = await this._response
            .setTitle('squad usage'.toUpperCase())
            .setText('proper usage \n ```!squad (join/list) [squad] [ign]```')
            .send()

        usage.delete({ timeout: this._timeout })
    }

    // private list()
}
