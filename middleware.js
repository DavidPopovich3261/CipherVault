import { connectmongo } from "./db/mongoconect.js";

export async function BasicAuth(req,res,next){
    const db = await connectmongo("users")
    let olduser = await db.collection("users").find({username:req.headers.username,password:req.headers.password}).toArray()
    if(olduser[0] !== undefined){
        next()
        return
    }
    res.status(400).send("There is no such user")
}