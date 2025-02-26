import 'dotenv/config'
import { connectMongoDB } from './db.js';
import { app } from './app.js';
import setupSocket from './socket.js';

const PORT=process.env.PORT || 8000

connectMongoDB()
.then(()=>{
    const server=app.listen(PORT,()=>{
        console.log("Server started at port - ",PORT);
    })
    setupSocket(server)
})
.catch((error)=>{
    app.on("error",(error)=>{
        console.log("ERR: ",error);
    })
})

