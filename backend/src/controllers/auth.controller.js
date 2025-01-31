import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signup=asyncHandler( async (req,res)=>{
    console.log("Request Headers:", req.headers);
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

    const accessToken=user.generateAccessToken();

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

export {
    signup
}