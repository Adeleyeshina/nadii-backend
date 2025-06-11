import Address from "../models/addressModel.js"
import mongoose from "mongoose"
export const getAllAddress = async (req, res) => {
    try {
        const address = await Address.find({user : req.user._id}).select("-__v -user")
        res.status(200).json(address)
    } catch (error) {
        console.log("Error in get address controller", error.message);
        res.status(500).json({message : "Internal server error"})
    }
}

export const addAddress = async (req, res) => {
    try {
        const {street, city, state, country, phone} = req.body

        if(!street || !city || !state || !country || !phone) {
            return res.status(400).json({message : 'Please fill all the input'})
        }

        const address = new Address ({...req.body, user : req.user._id})
        await address.save()
        res.status(201).json(address)
    } catch (error) {
        console.log("Error in add address controller", error.message);
        res.status(500).json({message : "Internal server error"})
    }
}
export const editAddress = async (req, res) => {
    try {
        const id = req.params.id
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(200).json({message : 'Invalid id'})
        }
        const updatedAddress = await Address.findOneAndUpdate({user : req.user.id, _id :  req.params.id}, req.body, {new : true})
        if(!updatedAddress) {
            return res.status(404).json({message : 'Address not found'})
        }
        res.status(200).json(updatedAddress)
    } catch (error) {
        console.log("Error in edit address controller", error.message);
        res.status(500).json({message : "Internal server error"})
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const id = req.params.id
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(200).json({message : 'Invalid id'})
        }

        const deleteAddress = await Address.findOneAndDelete({user : req.user._id, _id : id})
        if(!deleteAddress) {
           return res.status(400).json({message : "Address not found"})
        }

        res.status(200).json({message : "Address deleted successfully"})
    } catch (error) {
        console.log("Error in delete address controller", error.message);
        res.status(500).json({message : "Internal server error"})
    }
}