import { Message } from "../models/messages.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {mkdirSync, renameSync} from 'fs'

export const getMessages=asyncHandler(async(req,res)=>{
    
    const user1=req.user
    const user2=req.body.id

    if(!user1 || !user2){
        return res.status(400).json({success:false,message:"Both user id's are required"})
    }

    const messages=await Message.find({
        $or:[
            {sender:user1,recipient:user2},
            {sender:user2,recipient:user1}
        ]
    }).sort({timestamp:1})

    return res.status(200)
    .json({
        success:true,
        messages
    })
})

export const uploadFile=asyncHandler(async(req,res)=>{
    if(!req.file){
        return res.status(400).json({success:false,message:"file is required"});
    }
    const date=Date.now()
    let fileDir=`upload/files/${date}`
    let fileName=`${fileDir}/${req.file.originalname}`;

    mkdirSync(fileDir,{recursive:true})
    
    renameSync(req.file.path,fileName)

    return res.status(200).json({
        success:true,
        filePath:fileName
    })
})