import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getContactsForDMList, searchContacts } from "../controllers/contacts.controller.js";


const contactsRoute=Router()

contactsRoute.route('/search').post(verifyJWT,searchContacts)
contactsRoute.route("/get-contacts-for-dm").get(verifyJWT,getContactsForDMList)

export {contactsRoute};