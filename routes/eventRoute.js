import express from 'express'
import { addEvent, allEvent, deleteEvent } from '../controllers/eventController.js';
import { protectRoute, adminRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/", allEvent)
router.post("/", protectRoute, adminRoute, addEvent);
router.delete("/:id", protectRoute, adminRoute, deleteEvent);

export default router;