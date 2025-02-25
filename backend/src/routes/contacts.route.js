import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { searchContacts } from "../controllers/contacts.controller.js";


const contactsRoute=Router()

contactsRoute.route('/search').post(verifyJWT,searchContacts)


export {contactsRoute};