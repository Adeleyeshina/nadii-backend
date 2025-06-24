import Order from '../models/orderModel.js'
export const allOrders = async (req, res) => {
    try {
        const order = await Order.find({})
        res.status(200).json(order)
    } catch (error) {
        console.log("Error in all orders controller", error.message)
        return res.status(500).json({messsage : "internal server error"})
    }
}