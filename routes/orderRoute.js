import express from 'express'
import { allOrders } from '../controllers/orderController.js';
const router = express.Router()

router.get("/", allOrders)

export default router;