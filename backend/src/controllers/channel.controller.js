import mongoose from "mongoose";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createChannel=asyncHandler(async(req,res)=>{
    const {name,members}=req.body
    const userId=req.user

    const admin=await User.findById(userId)

    if(!admin){
        return res.status(400).json({success:false,message:"admin user not found"})
    }

    const validMembers=await User.find({_id:{$in:members}})

    if(validMembers.length!==members.length){
        return res.status(400).json({success:false,message:"Some members are not valid users"})
    }

    const newChannel=new Channel({
        name,
        members,
        admin:userId
    })

    await newChannel.save()

    return res.status(200).json({
        success:true,
        channel:newChannel
    })
})

export const getUserChannels=asyncHandler(async(req,res)=>{
    const userId=new mongoose.Types.ObjectId(req.user);

    const channels=await Channel.find({
        $or:[{admin:userId},{members:userId}]
    }).sort({updatedAt:-1})


    return res.status(200).json({
        success:true,
        channels
    })
})

export const getChannelMessages=asyncHandler(async(req,res)=>{

    const {channelId}=req.params

    const channel=await Channel.findById(channelId).populate({path:"messages",
        populate:{
        path:"sender",
        select:"firstName lastName email _id avatar color"
    }})

    if(!channel){
        return res.status(404).json({success:false,message:"channel not found"})
    }

    const messages=channel.messages

    return res.status(200).json({
        success:true,
        messages
    })
})