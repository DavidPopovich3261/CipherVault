import { Router } from "express";
import { connectmongo } from "../db/mongoconect.js";
import { supabase } from "../db/supaconect.js";
import { error } from "console";

export const messages = Router()

messages.post("/encrypt", async (req, res) => {
    if (!(req.body && req.body.cipherType && req.body.message)) {
        return res.status(400).send("Bad parameters")
    }
    if (!(req.body.cipherType == "reverse")) {
        return res.status(400).send("Unrecognized encryption type. Can only be encrypted using the reverse method.")
    }
    let encryptedText = req.body.message.split('').reverse().join('');
    const resins = await supabase.from('messages')
        .insert({ username: req.headers.username, cipher_type: req.body.cipherType, encrypted_text: encryptedText })
    if (resins.status == 201) {
        const db = await connectmongo("users")
        await db.collection("users").updateOne({ username: req.headers.username }, { $inc: { "encryptedMessagesCount": 1 } })
    }
    const message = await supabase.from("messages").select().eq("encrypted_text", encryptedText)
    res.status(message.status).json({ id: message.data[0].id, cipherType: message.data[0].cipher_type, encryptedText: message.data[0].encrypted_text });
})

messages.post("/decrypt", async (req, res) => {
    if (!(req.body && req.body.messageId && parseInt(req.body.messageId))) {
        return res.status(400).send("Bad parameters")
    }
    const message = await supabase.from("messages").select().eq("id", parseInt(req.body.messageId))
    if (message.data[0].cipher_type == "reverse") {
        let decryptedText = message.data[0].encrypted_text.split('').reverse().join('');
        return res.status(message.status).json({ id: message.data[0].id, decryptedText: decryptedText })
    }
    return res.status(message.status).json({ id: message.data[0].id, decryptedText: null, error: "CANNOT_DECRYPT" })
})

messages.get("/",async (req,res)=>{
    if(!(req.query.username )){
        return res.status(400).send("Bad parameters")
    }
    const message = await supabase.from("messages").select().eq("username", req.query.username)
    res.status(message.status).json({items:message.data})
})