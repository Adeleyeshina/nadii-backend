import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    images: { 
        type: [String], 
        required: [true, "At least one image is required"] 
    },
    featuredImage: { 
        type: String, 
        required: [true, "Featured image is required"] 
    },

    isFeatured : {
        type : Boolean,
        default : false
    },
    soldOut : {
        type : Boolean,
        default : false
    }
},
{timestamps : true})

const Product = mongoose.model("Product", productSchema);

export default Product;