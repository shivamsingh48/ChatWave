import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app=express();

app.use(cors({
    origin:process.env.ORIGIN,
    methods:["GET","POST","PATCH","DELETE","PUT"],
    credentials:true,
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

import authRouter from './src/routes/auth.route.js'


app.use('/api/v1/auth',authRouter)

export {app};