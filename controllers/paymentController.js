import Address from "../models/addressModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js"
import axios from 'axios'

export const initializePayment = async (req, res) => {
    try {
        const user = req.user;
        const {addressId} = req.body
        if(!addressId) {
            return res.status(400).json({message : "Address is required"})
        }

        const userAddress = await Address.findOne({_id : addressId, user : req.user._id})
        if (!userAddress) {
            return res.status(400).json({message : "Invalid Address"})
        }
        const cartProducts = await Product.find({_id : {$in : user.cartItems.map(item =>  item.id)}})
        let total = 0;
        const products = []

        
        for (const cartItem of user.cartItems) {
        const product = cartProducts.find(p => p._id.toString() === cartItem.id);
        if (!product) continue;

        total += product.price * cartItem.quantity;
        products.push({
            product: product._id,
            quantity: cartItem.quantity,
            price: product.price
        });
        }
        const paystackRes = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
            email: user.email,
            amount: total * 100,
            metadata: {
            fullName : user.name, 
            },
            callback_url: `${process.env.FRONTEND_URI}/checkout-success`
        },
        {
            headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
            }
        }
        )  
        const {authorization_url, reference} = paystackRes.data.data;
        await Order.create({
            user: user._id,
            products,
            totalAmount : total,
            reference,
            //address: userAddress._id,
            status: 'pending'
        });
        res.json({authorization_url, reference})

        } catch (error) {
        console.log("Error in initialize payment controller", error.message);
        res.status(500).json({message : "Internal server error"})
        
    }
}

export const verify = async (req, res) => {
    const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { status, amount } = response.data.data;
    const order = await Order.findOne({ reference });

    if (!order) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    order.status = status;
    await order.save();
    if (order.status === 'success') {
        req.user.cartItems = [];
        await req.user.save();
    }

    res.json({ status, amount: amount / 100 }); // Convert back to NGN
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Payment verification failed' });
  }
}
