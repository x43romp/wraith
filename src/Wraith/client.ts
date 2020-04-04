import { MongoClient, Collection } from 'mongodb'

export async function connect(collection: string) {
    const url = process.env.MONGO_URL
    const db = process.env.MONGO_DB

    return (await MongoClient.connect(url))
        .db(db)
        .collection(collection)
}

export default class WraithClient {
    protected _url: string
    protected _database: string
    protected _collection: string

    protected _client: Collection<any>

    constructor(collection?: string) {
        this._url = process.env.MONGO_URL
        this._database = process.env.MONGO_DATA
        this._collection = collection

        MongoClient.connect(WraithClient.connectionString()).catch(error => { throw error })
    }

    public static connectionString() {
        const config = {
            url: process.env.MONGO_URL,
            user: process.env.MONGO_USER,
            pass: process.env.MONGO_PASS,
            data: process.env.MONGO_DATA
        }

        const connection = `mongodb+srv://${config.user}:${config.pass}@${config.url}/test?retryWrites=true&w=majority`
        return connection
    }

    protected async connect(collection?: string) {
        // use _collection if no collection
        if (!collection && this._collection) collection = this._collection
        const client = (await MongoClient.connect(WraithClient.connectionString())).db(this._database).collection(collection)
        this._client = client
        return client
    }
}
