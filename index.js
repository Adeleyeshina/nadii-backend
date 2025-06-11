import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import db from './connectDB/db.js'
import authRoutes from './routes/authRoutes.js'
import productRoute from './routes/productRoutes.js'
import cartRoute from'./routes/cartRoute.js'
import paymentRoute from'./routes/paymentRoute.js'
import contactRoute from './routes/contactRoute.js'
import bookngRoute from './routes/bookingRoute.js'
import addressRoute from './routes/addressRoute.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())
app.use(cors({
    origin : process.env.FRONTEND_URI,
    methods : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders : ['Content-Type', 'Authorization'],
    credentials : true
}))

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/payments", paymentRoute)
app.use("/api/contactlist", contactRoute)
app.use("/api/booking", bookngRoute)
app.use("/api/address", addressRoute)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    db()
})