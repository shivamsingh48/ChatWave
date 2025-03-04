import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { fileURLToPath } from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express();

app.use(cors({
    origin:process.env.ORIGIN,
    methods:["GET","POST","PATCH","DELETE","PUT"],
    credentials:true,
}))

app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

import authRouter from './src/routes/auth.route.js'
import { contactsRoute } from './src/routes/contacts.route.js';
import { messagesRouter } from './src/routes/messages.routes.js';
import { channelRouter } from './src/routes/channel.route.js';

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/contacts',contactsRoute)
app.use('/api/v1/messages',messagesRouter)
app.use('/api/v1/channels',channelRouter)

export {app};