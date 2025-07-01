import express from 'express'
import { allOrders, userOrders } from '../controllers/orderController.js';
const router = express.Router()
import {protectRoute, adminRoute} from '../middleware/authMiddleware.js'

router.get("/admin", protectRoute, adminRoute, allOrders)
router.get("/user", protectRoute, userOrders)

export default router;