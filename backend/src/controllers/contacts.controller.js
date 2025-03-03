import { asyncHandler } from "../utils/asyncHandler.js"
import {User} from '../models/user.model.js'
import mongoose from "mongoose"
import { Message } from "../models/messages.model.js"

const searchContacts=asyncHandler(async(req,res)=>{
    
    const {searchTerm}=req.body

    if(searchTerm === undefined || searchTerm===null){
        return res.status(400).json({success:false,message:"serach term is required"})
    }

    const sanitizedSearchTerm=searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "//$&"
    )

    const regex=new RegExp(sanitizedSearchTerm,"i")

    const contacts=await User.find({
        $and:[
            {_id:{$ne:req.user}},
            {
                $or:[{firstName:regex},{lastName:regex},{email:regex}]
            }
        ]
    })

    return res.status(200)
    .json({
        success:true,
        contacts
    })
})

const getContactsForDMList=asyncHandler(async(req,res)=>{
    
    let {user}=req
    user=new mongoose.Types.ObjectId(user)
 
    const contacts=await Message.aggregate([
        {
            $match:{
                $or:[{sender:user},{recipient:user}]
            }
        },
        {
            $sort:{timestamp:-1}
        },
        {
            $group:{
                _id:{
                    $cond:{
                        if:{$eq:["$sender",user]},
                        then:"$recipient",
                        else:"$sender"
                    }
                },
                lastMessageTime:{$first:"$timestamp"}
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as:"contactInfo"
            }
        },
        {
            $unwind:"$contactInfo"
        },
        {
            $project:{
                _id:1,
                lastMessageTime:1,
                email:"$contactInfo.email",
                firstName:"$contactInfo.firstName",
                lastName:"$contactInfo.lastName",
                avatar:"$contactInfo.avatar",
                color:"$conatctInfo.color",
            }
        },
        {
            $sort:{lastMessageTime:-1}
        }
    ])

    return res.status(200)
    .json({
        success:true,
        contacts
    })
})

const getAllContacts=asyncHandler(async(req,res)=>{
    
    const users=await User.find({_id:{$ne:req.user}},"firstName lastName _id email")

    const contacts=users.map((user)=>(
        {
            label:user.firstName ?`${user.firstName} ${user.lastName}`:user.email,
            value:user._id
        }
    ))

    return res.status(200)
    .json({
        success:true,
        contacts
    })
})

export {searchContacts,getContactsForDMList,getAllContacts}