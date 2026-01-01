import express from "express";
import { register,users } from "./routers/register.js";
import { messages } from "./routers/messages.js";
import { BasicAuth } from "./middleware.js";


const app = express()
app.use(express.json())
app.use("/api/auth/register",register)
app.use("/api/messages",BasicAuth,messages)
app.use("/api/users/me",users)

app.listen(3000,()=>{
    console.log("server run ...");
})