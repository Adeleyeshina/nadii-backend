import express from 'express'
import { protectRoute } from '../middleware/authMiddleware.js';
import { initializePayment, verify } from '../controllers/paymentController.js';

const router = express.Router();

router.post("/initialize", protectRoute, initializePayment)
router.get("/verify/:reference", protectRoute, verify)

export default router;