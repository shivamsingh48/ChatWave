import { asyncHandler } from "../utils/asyncHandler.js"
import {User} from '../models/user.model.js'

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

export {searchContacts}