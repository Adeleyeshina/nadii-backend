import Order from '../models/orderModel.js'
import User from '../models/userModel.js'


export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate({
            path : 'user',
            select : 'name email'
        }).populate({
        path : 'products.product',
        select : 'name image'
       }).populate({
        path : 'address',
        select : "street city state phone"
       }).sort({createdAt : -1})
        res.status(200).json({orders})
    } catch (error) {
        console.log("Error in user orders controller", error.message)
        return res.status(500).json({messsage : "internal server error"})
    }
}
export const userOrders = async (req, res) => {
    try {
       const user = await User.findById(req.user._id)
       if(!user) {
        return res.status(404).json({message : 'User not found'})
       }

       const order = await Order.find({user : user._id}).populate({
        path : 'products.product',
        select : 'name image'
       }).populate({
        path : 'address',
        select : "street city state phone"
       }).sort({createdAt : -1})
       
       if (order.length === 0) {
        return res.status(200).json({message : "You have't place any other"})
       }
       res.status(200).json(order)
    } catch (error) {
        console.log("Error in user orders controller", error.message)
        return res.status(500).json({messsage : "internal server error"})
    }
}