import WraithConnection from "./connection";
import { FilterQuery } from "mongodb";
import { Guild, User, UserManager } from "discord.js";

export default class WraithGame extends WraithConnection {

    private _game: string;
    private _code: string;

    constructor(game: string) {
        super('games')
        this._game = game
        this.loadCode(game)
    }

    private async loadCode(game: string): Promise<string> {
        const filter: FilterQuery<any> = { alts: { $all: [game] } }
        const res = await this.query(filter)

        const response: string = res[0]['code']

        this._code = response
        return response
    }

    private async getGame(): Promise<string> {
        if (this._game == undefined)
            return await this.loadCode(this._game)
        else
            return this._game
    }

    public addUser(guild: string | Guild, user: string | User) {
        const gid: string = (typeof guild === 'string') ? guild : (guild as Guild).id
        const uid: string = (typeof user === 'string') ? user : (user as User).id

        const filter: FilterQuery<any> = {};
    }

}
