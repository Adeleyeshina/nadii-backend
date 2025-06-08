import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, toggleFeaturedProduct } from '../controllers/productController.js'
import { protectRoute, adminRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/", protectRoute, adminRoute, getAllProducts)
router.get("/featured", getFeaturedProducts)
router.get("/", protectRoute, adminRoute, createProduct)
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct)
router.get("/:id", protectRoute, adminRoute, deleteProduct)

export default router