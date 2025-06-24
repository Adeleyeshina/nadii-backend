import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    products : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product",
                required : true
            },
            quantity : {
                type : Number,
                required : true,
                min : 1
            },
            price : {
                type : Number,
                required : true,
                min : 0
            },
        }
    ],
    totalAmount : {
        type : Number,
        required : true,
        min : 0
    },
    reference : {
        type : String,
        unique : true,
    },
    address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address"
    },
    status : {
        type : String,
        enum : ["pending", "paid", "failed", "abandoned", "success"],
        default : "pending"
    }
}, {timestamps : true})

const Order = mongoose.model("order", orderSchema);

export default Order