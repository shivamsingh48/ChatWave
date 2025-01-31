import dotenv from 'dotenv'
import { connectMongoDB } from './db.js';
import { app } from './app.js';

dotenv.config();

const PORT=process.env.PORT || 8000


connectMongoDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log("Server started at port - ",PORT);
    })
})
.catch((error)=>{
    app.on("error",(error)=>{
        console.log("ERR: ",error);
    })
})