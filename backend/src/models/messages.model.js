import mongoose, { Schema } from "mongoose";

const messageSchema=new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recipient:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:false
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required:true
    },
    content:{
        type:String,
        required:function(){
            return this.messageType==="text"
        }
    },
    fileUrl:{
        type:String,
        required:function(){
            return this.messageType==="file"
        }
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

export const Message=mongoose.model("Message",messageSchema);