import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getSingleProduct, recommendedProducts, toggleFeaturedProduct } from '../controllers/productController.js'
import { protectRoute, adminRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/", getAllProducts)
router.get("/single/:id", getSingleProduct)
router.get("/recommended", recommendedProducts)
router.get("/featured", getFeaturedProducts)
router.post("/", protectRoute, adminRoute, createProduct)
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)

export default router