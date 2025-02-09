import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {renameSync,unlinkSync} from 'fs'

const signup=asyncHandler( async (req,res)=>{
    const {email,password}=req.body

    if(!email || !password){
        return res.status(400).json({ success:false, message: "Email and password are required" });
    }

    const existedUser=await User.findOne({email})

    if(existedUser){
        return res.status(409).json({success:false, message: "Email already exists" });
    }

    const user=await User.create({
        email,
        password
    })

    const accessToken=await user.generateAccessToken();

    console.log(accessToken);
    

    res.cookie("accessToken",accessToken,{
        maxAge: 15 * 24 * 60 * 60 * 1000,
        secure:true,
        sameSite:"None"
    })
        
    return res.status(201).json({
        success:true,
        user:{
            id:user._id,
            email:user.email,
            profileSetup:user.profileSetup
        }
    })

})

const login=asyncHandler( async (req,res)=>{
    const {email,password}=req.body

    if(!email || !password){
        return res.status(400).json({ success:false, message: "Email and password are required" });
    }

    const user=await User.findOne({email})

    if(!user){
        return res.status(409).json({success:false, message: "user with given email not found" });
    }

    const checkPassword=await user.isPasswordCheck(password);

    if(!checkPassword){
        return res.status(401).json({success:false,message:"Invalid password"});
    }

    const accessToken=await user.generateAccessToken();

    res.cookie("accessToken",accessToken,{
        maxAge: 15 * 24 * 60 * 60 * 1000,
        secure:true,
        sameSite:"None"
    })
        
    return res.status(200).json({
        success:true,
        user:{
            id:user._id,
            email:user.email,
            profileSetup:user.profileSetup,
            firstName:user.firstName,
            lastName:user.lastName,
            avatar:user.avatar,
            color:user.color
        }
    })

})

const getUser=asyncHandler( async (req,res)=>{

    const userId=req.user;
    const user=await User.findById(userId);

    if(!user){
        return res.status(400).json({success:false,message:"User not found"})
    }

    return res.status(200).json({
        success:true,
        user:{
            id:user._id,
            email:user.email,
            profileSetup:user.profileSetup,
            firstName:user.firstName,
            lastName:user.lastName,
            avatar:user.avatar,
            color:user.color
        }
    })

})

const updateProfile=asyncHandler( async (req,res)=>{

    const {firstName,lastName,color}=req.body;    

    if(!firstName || !lastName){
        return res.status(400).json({success:false,message:"firstname lastname and color is required"})
    }

    const userId=req.user;
    const user=await User.findByIdAndUpdate(
        userId,
        {
            firstName,lastName,color,profileSetup:true
        },
        {
            new:true
        }
    )

    if(!user){
        return res.status(400).json({success:false,message:"User not found"})
    }

    return res.status(200).json({
        success:true,
        user:{
            id:user._id,
            email:user.email,
            profileSetup:user.profileSetup,
            firstName:user.firstName,
            lastName:user.lastName,
            avatar:user.avatar,
            color:user.color
        }
    })

})

const uploadAvatar=asyncHandler(async(req,res)=>{
    if(!req.file){
        return res.status(400).json({success:false,message:"file is required"});
    }
    const date=Date.now()
    let fileName="upload/profiles/"+date+req.file.originalname;
    
    renameSync(req.file.path,fileName)

    const updatedUser=await User.findByIdAndUpdate(req.user,{
        avatar:fileName
    },{
        new:true,
        runValidators:true
    })
    return res.status(200).json({
        success:true,
        avatar:updatedUser.avatar
    })
})

const deleteAvatar=asyncHandler(async(req,res)=>{
    
    const userId=req.user
    const user=await User.findById(userId)

    if(!user){
        return res.status(401).json({success:false,message:"User not found"})
    }

    if(user.avatar){
        unlinkSync(user.avatar)
    }

    user.avatar=null;
    user.save()


    return res.status(200).json({
        success:true,
        message:"profile image removed successfully"
    })
})

const logout=asyncHandler(async(req,res)=>{
    
    const userId=req.user
    const user=await User.findById(userId)

    console.log(user);
    

    if(!user){
        return res.status(401).json({success:false,message:"User not found"})
    }

    return res.status(200)
    .clearCookie("accessToken",{secure:true,sameSite:"None"})
    .json({
        success:true,
        message:"logout successfull"
    })
})

export {
    signup,login,getUser,updateProfile,uploadAvatar,deleteAvatar,logout
}