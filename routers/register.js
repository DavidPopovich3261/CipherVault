import { Router } from "express";
import { connectmongo } from "../db/mongoconect.js";

export const register = Router()
export const users = Router()

register.post("/", async (req, res) => {
    if (!(req.body && req.body.username && req.body.password && Object.keys(req.body).length == 2)) {
        return res.status(400).send("Bad parameters")
    }
    const db = await connectmongo("users")
    let olduser = await db.collection("users").find(req.body).toArray()

    if (olduser[0] == undefined) {
        req.body.createdAt = new Date().toISOString()
        req.body.encryptedMessagesCount = 0
        const newuser = await db.collection("users").insertOne(req.body)
        return res.status(201).json({ id: newuser.insertedId, username: req.body.username });
    } return res.status(400).send("The user already exists in the system")
})

users.get("/",async(req,res)=>{
    const db = await connectmongo("users")
    let user = await db.collection("users").find({username:req.headers.username}).toArray()
    res.status(200).json({"username":user[0].username,"encryptedMessagesCount": user[0].encryptedMessagesCount})
})