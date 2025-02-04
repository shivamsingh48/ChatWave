import express from 'express'
import { getUser, login, signup, updateProfile } from '../controllers/auth.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router=express.Router()

router.route('/signUp').post(signup)
router.route('/login').post(login)

router.route('/userInfo').get(verifyJWT,getUser)
router.route('/update-profile').patch(verifyJWT,updateProfile)

export default router