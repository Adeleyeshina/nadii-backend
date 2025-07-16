import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getSingleProduct, recommendedProducts, toggleFeaturedProduct, toggleSoldOut, updateProduct } from '../controllers/productController.js'
import { protectRoute, adminRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get("/", getAllProducts)
router.get("/single/:id", getSingleProduct)
router.get("/recommended", recommendedProducts)
router.get("/featured", getFeaturedProducts)
router.post("/", protectRoute, adminRoute, createProduct)
router.patch("/togglefeatured/:id", protectRoute, adminRoute, toggleFeaturedProduct)
router.patch("/soldout/:id", protectRoute, adminRoute, toggleSoldOut)
router.put("/update/:id", protectRoute, adminRoute, updateProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)

export default router