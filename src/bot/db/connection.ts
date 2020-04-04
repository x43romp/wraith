import { MongoClient, Db, InsertOneWriteOpResult, InsertWriteOpResult, Collection, FilterQuery, UpdateQuery, UpdateOneOptions, UpdateWriteOpResult } from 'mongodb'

/**
 *
 */
export default class WraithConnection {
    private _url: string
    private _database: string
    private _collection: string

    private _db: Db

    constructor(collection: string) {
        this._url = process.env.MONGO_URL
        this._database = process.env.MONGO_DB
        this._collection = collection

        MongoClient.connect(this._url, (error, result) => {
            if (error) throw error
            this._db = result.db(this._database)
        })
    }

    private client(): Promise<MongoClient> {
        return MongoClient.connect(this._url)
    }

    private async test(): Promise<Collection<any>> {
        const cli: MongoClient = await MongoClient.connect(this._url)
        const db: Db = cli.db(this._database)
        const col: Collection<any> = db.collection(this._collection)

        return col
    }

    protected async collection(): Promise<Collection<any>> {
        return (await MongoClient.connect(this._url))
            .db(this._database)
            .collection(this._collection)
    }

    public async insertOne(obj): Promise<void | InsertOneWriteOpResult<any>> {
        return (await this.collection()).insertOne(obj)
    }

    protected async insertMany(obj: any[]): Promise<void | InsertWriteOpResult<any>> {
        return (await this.collection()).insertMany(obj)
    }

    protected async query(filter: FilterQuery<any>): Promise<void | any[] | Collection<any>> {
        return await this.collection().then(async client => {
            return await client.find(filter).toArray()
        })
    }

    protected async update(filter: FilterQuery<any>, update: UpdateQuery<any>, opts?: UpdateOneOptions) {
        return this.collection().then(async client => {
            if (opts)
                return await client.update(filter, update, opts)
            else
                return await client.update(filter, update)
        })
    }

    protected async updateOne(filter: FilterQuery<any>, update: UpdateQuery<any> | Partial<any>, opts?: UpdateOneOptions): Promise<UpdateWriteOpResult> {
        return await this.collection().then(async client => {
            if (opts)
                return await client.updateOne(filter, update, opts)
            else
                return await client.updateOne(filter, update)
        })
    }
}
