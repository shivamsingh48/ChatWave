import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, uploadFile } from "../controllers/message,controller.js";
import multer from "multer";


const messagesRouter=Router()
const upload=multer({dest:"upload/files/"})

messagesRouter.route("/get-messages").post(verifyJWT,getMessages)
messagesRouter.route("/upload-file").post(verifyJWT,upload.single("file"),uploadFile)

export {messagesRouter}