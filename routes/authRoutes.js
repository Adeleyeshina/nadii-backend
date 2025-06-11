import express from 'express'
import { logout, signup, login, verify, forgetPassword, resetPassword, refreshToken, getProfile, updateAccountInfo } from '../controllers/authController.js'
import {protectRoute} from '../middleware/authMiddleware.js'
const router = express.Router()


router.post("/signup", signup)
router.get("/verify/:token",verify)
router.post("/login", login)
router.post("/logout", logout)
router.post("/forget", forgetPassword)
router.post("/reset/:token", resetPassword)
router.post("/refresh-token", refreshToken)
router.patch("/update", protectRoute, updateAccountInfo);
router.get("/profile", protectRoute, getProfile);


export default router