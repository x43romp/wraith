import * as Discord from 'discord.js'

export default class BotMessage {
    private _channel: Discord.TextChannel | Discord.DMChannel;
    private _embed?: Discord.MessageEmbed;
    private _text?: string;

    constructor(channel: Discord.TextChannel | Discord.DMChannel) {
        this._channel = channel
        this._embed = new Discord.MessageEmbed()
    }

    private embed(): Discord.MessageEmbed {
        if (!this._embed) this._embed = new Discord.MessageEmbed().setDescription(this._text)
        this._text = null
        return this._embed
    }

    public getEmbed(): Discord.MessageEmbed {
        return this._embed
    }

    public send(message?: Discord.Message | Discord.PartialMessage): Promise<Discord.Message> {
        const response = (this._text) ? this._text : this._embed

        if (message) {
            return message.reply(response)
        } else {
            return this._channel.send(response)
        }
    }

    public clear(): BotMessage {
        this._text = null
        this._embed = null
        return this
    }

    public addField(name: string, value: string, inline: boolean = false): BotMessage {
        this.embed().addField(name, value, inline)
        return this
    }

    public addFields(...fields: Discord.EmbedFieldData[]) {
        this.embed().addFields(fields)
    }

    public setAuthor(author: string): BotMessage {
        this.embed().setAuthor(author)
        return this
    }

    public setColor(color: Discord.ColorResolvable) {
        this.embed().setColor(color)
        return this
    }

    public setDescription(text: string) {
        this.setText(text)
    }

    public setFooter(footer: string): BotMessage {
        this.embed().setFooter(footer)
        return this
    }

    public setImage(image: string): BotMessage {
        this.embed().setImage(image)
        return this
    }

    public setThumbnail(thumbnail: string): BotMessage {
        this.embed().setImage(thumbnail)
        return this
    }

    public setTimestamp(timestamp: number | Date) {
        this.embed().setTimestamp(timestamp)
    }

    public setText(text: string): BotMessage {
        this._text = text
        if (this._embed) { this.embed().setDescription(text) }
        return this
    }

    public setURL(url: string): BotMessage {
        this.embed().setURL(url)
        return this
    }

    public setTitle(title: string): BotMessage {
        this.embed().setTitle(title)
        return this
    }
}
