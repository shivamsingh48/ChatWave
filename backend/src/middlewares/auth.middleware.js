import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT=asyncHandler(async(req,res,next)=>{
    const token=req.cookies.accessToken
    if(!token){
        res.status(401).json({success:false,message:"Unauthorized access"})
    }
    const decoded_token=jwt.verify(token,process.env.ACCESS_TOKEN_KEY)
    
    if(!decoded_token){
        res.status(500).json({success:false,message:"Internal server error"})
    }

    req.user=decoded_token._id;
    next()
})