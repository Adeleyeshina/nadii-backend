import express from 'express'
import { allContactList, deleteContact, sendContact, singleContactList } from '../controllers/contactController.js'
import { adminRoute, protectRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/", protectRoute, adminRoute, allContactList)
router.get("/:id", protectRoute, adminRoute, singleContactList)
router.post("/", sendContact)
router.delete("/:id", protectRoute, adminRoute, deleteContact)
export default router