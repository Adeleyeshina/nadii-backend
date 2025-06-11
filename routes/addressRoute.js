import express from 'express'
import { addAddress, deleteAddress, editAddress, getAllAddress } from '../controllers/addressController.js'
import { protectRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/", protectRoute, getAllAddress)
router.post("/", protectRoute, addAddress)
router.put("/:id", protectRoute, editAddress)
router.delete("/:id", protectRoute, deleteAddress)

export default router