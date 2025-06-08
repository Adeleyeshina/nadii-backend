import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import db from './connectDB/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoute from './routes/productRoutes.js'
import cartRoute from'./routes/cartRoute.js'
import paymentRoute from'./routes/paymentRoute.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())
app.use(cors({
    origin : import.meta.env.FRONTEND_URI,
    methods : ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders : ['Content-Type', 'Authorization'],
    credentials : true
}))

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/payments", paymentRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    db()
})