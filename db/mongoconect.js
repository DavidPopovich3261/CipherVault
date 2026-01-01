import { MongoClient } from "mongodb";
import 'dotenv/config'

let db
export async function connectmongo(namedb) {
    if(db) return db
    const client =  new MongoClient(process.env.MONGOURI)
    await client.connect()
    db = client.db(namedb)    
    return db
}