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
                    featuredImage : 1
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
        const { name, description, price, featuredImage, images } = req.body;

        if (!featuredImage) {
            return res.status(400).json({ message: "Featured image is required" });
        }
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ message: "At least one additional image is required" });
        }

        // upload featured image
        const featuredResult = await cloudinary.uploader.upload(featuredImage, { folder: "products" });

        // upload other images
        const uploadedImages = [];
        for (const img of images) {
            const result = await cloudinary.uploader.upload(img, { folder: "products" });
            uploadedImages.push(result.secure_url);
        }

        const product = await Product.create({
            name,
            description,
            price,
            featuredImage: featuredResult.secure_url,
            images: uploadedImages,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete featured image
        if (product.featuredImage) {
            const publicId = product.featuredImage.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Deleted featured image from Cloudinary");
            } catch (error) {
                console.log("Error deleting featured image", error);
            }
        }

        // Delete additional images
        if (product.images && Array.isArray(product.images)) {
            for (const img of product.images) {
                const publicId = img.split("/").pop().split(".")[0];
                try {
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                } catch (error) {
                    console.log("Error deleting image", error);
                }
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



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
export const toggleSoldOut = async(req, res) => {
    try {
        
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(400).json({message : 'Invalid Product id'})
        }
        const product = await Product.findById(req.params.id)
        if(!product) {
            return res.status(404).json({message : "Product not found"})
        }
        product.soldOut = !product.soldOut
        const updatedProduct = await product.save()
        await updatedProductsCache ()
        res.status(200).json(updatedProduct)
    } catch (error) {
        console.log("Error in toggleSoldOUt controller", error);
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