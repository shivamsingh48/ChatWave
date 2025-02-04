import { compare, genSalt, hash } from "bcrypt";
import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken'


const userSchema=new Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    avatar:{
        type:String,
        required:false
    },
    color:{
        type:Number,
        required:false
    },
    profileSetup:{
        type:Boolean,
        default:false
    }
})

userSchema.pre("save",async function(next){
    const salt=await genSalt();
    this.password=await hash(this.password,salt);
    next()
})

userSchema.methods.isPasswordCheck=async function(password){
    return await compare(password,this.password)
}

userSchema.methods.generateAccessToken=async function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
    },process.env.ACCESS_TOKEN_KEY,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
export const User=mongoose.model("User",userSchema);