import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages } from "../controllers/message,controller.js";


const messagesRouter=Router()

messagesRouter.route("/get-messages").post(verifyJWT,getMessages)

export {messagesRouter}