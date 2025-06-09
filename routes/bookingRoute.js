import express from 'express'
import {protectRoute, adminRoute} from '../middleware/authMiddleware.js'
import {createBooking, getAllBooking, getSingleBooking } from '../controllers/bookingController.js'

const router = express.Router()

router.get("/", protectRoute, adminRoute, getAllBooking)
router.get("/:id", protectRoute, adminRoute, getSingleBooking)
router.post("/", createBooking)
// router.patch("/admin/status/:id", protectRoute, adminRoute, adminStatusUpdate)
// router.put("/user/update/:id", protectRoute, userBookingUpdate)


export default router