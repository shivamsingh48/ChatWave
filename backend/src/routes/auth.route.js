import express from 'express'
import { deleteAvatar, getUser, login, logout, signup, updateProfile, uploadAvatar } from '../controllers/auth.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import multer from 'multer'

const upload=multer({dest:"upload/profiles/"})

const router=express.Router()

router.route('/signUp').post(signup)
router.route('/login').post(login)

router.route('/userInfo').get(verifyJWT,getUser)
router.route('/update-profile').patch(verifyJWT,updateProfile)
router.route('/add-profile-avatar').post(verifyJWT,upload.single("profile-image"),uploadAvatar)
router.route('/delete-profile-avatar').delete(verifyJWT,deleteAvatar)
router.route('/logout').post(verifyJWT,logout)


export default router