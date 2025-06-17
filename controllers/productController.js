import Product from "../models/productModel.js"
import redis  from "../lib/redis.js"
import cloudinary from '../lib/cloudinary.js'
import mongoose from "mongoose"
export const getAllProducts = async (req, res) => {
    try {
        const product = await Product.find({})
        res.status(200).json(product)
    } catch (error) {
        console.log("Error in all get all product controller", error.message);
        res.send(500).json({message : "Server error"})
    }
}

export const getSingleProduct = async (req, res) => {
    const {id} = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message : "Invalid Product Id"})
        }

        const product = await Product.findById(id) 
        if(!product) {
            return res.status(404).json({message : "Product not found"})
        }
        res.status(200).json(product)
    } catch (error) {
        console.log("Error in get single product controller", error.message);
        res.send(500).json({message : "Server error"})
    }
}

export const recommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {$sample : {size : 4}},
            {
                $project : {
                    _id : 1,
                    name : 1,
                    price : 1,
                    image : 1
                }
            }
        ])
        
        res.status(200).json(products)
    } catch (error) {
        console.log("Error in recommended product controller", error.message);
        res.send(500).json({message : "Server error"})
    }
}
export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products")
        if(featuredProducts) {
            return res.json(JSON.parse(featuredProducts))
        }
        //if not in redis then fetch in mongodb
        featuredProducts = await Product.find({isFeatured : true}).lean();

        if(!featuredProducts) {
            return res.status(404).json({message : 'No featured product found'})
        }
        
        //store in redis for

        await redis.set("featured_products",  JSON.stringify(featuredProducts))
        res.json(featuredProducts)
    } catch (error) {
        console.log("Error in getFeaturedProduct controller", error.message);
        res.status(500).json({messag : 'Internal server'})
    }
}

export const createProduct = async (req, res) => {
    try {
        const {name, description, price, image} = req.body
        
        let cloudinaryResponse = null
        
        if(image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder : "products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image : cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url :'',

        })
        res.status(201).json(product)
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({message : "Server error", error : error.message})
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product) {
            return res.status(404).json({mesage : "Product not found"})
        }
        
        if(product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("deleted image from cloudinary");
                
            } catch (error) {
                console.log("Error deleting image from cloudinary", error);
                
            }
        }

        await Product.findByIdAndDelete(req.params.id)
        res.json({message : "Product deleted succesfully"})
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({message : "Server error", error : error.message})
    }
}


export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(product) {
            product.isFeatured = !product.isFeatured
            const updatedProduct = await product.save()
            await updatedProductsCache ()
            res.json(updatedProduct)
        }else {
            res.status(404).json({message : "Product not found"})
        }
    } catch (error) {
        console.log("Error in toggleFeatutedProduct controller", error.messasge);
        res.status(500).json({message : "Server error", error : error.message})
    }
}

async function updatedProductsCache() {
    try {
        const featuredProducts = await Product.find({isFeatured : true}).lean()
        
        await redis.set("featured_products", JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("error in update cache function", error);
        
    }
}