import mongoose from "mongoose";
import Booking from "../models/bookingModel.js"
import { adminMessage } from "../lib/nodemailer.js";

export const getAllBooking = async (req, res) => {
    try {
        if (req?.user?.role === 'admin') {
            const bookings = await Booking.find({})
            return res.status(200).json({length : bookings.length, bookings})
        }
        else if (req?.user?.role === 'customer') {
            const booking = await Booking.find({email : req.user.email})
            return res.status(200).json(booking)
        } else {
            return res.status(400).json({message : "Unauthorized"})
        }

        
    } catch (error) {
        console.log("Error in get all booking controller", error.message);
        res.status(500).json({message : "Internal server error"})
        
    }
}

export const getSingleBooking = async (req, res) => {
    try {
        const {id} = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message : "Invalid Id"})
        }

        if(req?.user?.role === 'admin') {
            const booking = await Booking.findById(id)
            if (!booking) {
            return res.status(404).json({message : "Not found"})
            }
            res.status(200).json(booking)
        }

        else if(req?.user?.role === 'customer') {
            const booking = await Booking.findOne({_id : id, email : req.user.email})
            if(!booking) {
                return res.status(400).json({message : "You don't have booking with the id"})
            }
            return res.json(booking)
        }
        else {
            return res.status(400).json({message : "Unauthorized"})
        }

    } catch (error) {
        console.log("Error in geting single booking controller", error.message);
        res.status(500).json({message : "Internal server error"})
    }
}

export const createBooking = async (req, res) => {
    try {
        const {name, phone, service, date, time} = req.body

        if (!name || !phone || !service || ! date || !time) {
            return res.status(400).json({message : "All the input must be field"})
        }

        try {
            await adminMessage("A new booking", "Booked", JSON.stringify(req.body))
        } catch (error) {
            console.log("Error sending messaage", error.message);
            return res.status(500).json({message : "An error occured"})
        }
        const booking = await Booking.create(req.body)
        res.status(201).json({message :  "Message Sent"})
    } catch (error) {
        console.log("Error in creating booking controller", error.message);
        res.status(500).json({message : "Internal server error"})
    }
}

// export const adminStatusUpdate =async (req, res) => {
//     try {
//         const {id} = req.params

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({message : "Invalid Id"})
//         }
//         const booking = await Booking.findByIdAndUpdate(id, {status : req.body.status}, {new : true})
//         if(!booking) {
//             return res.status(404).json({message : "No booking found"})
//         }
//         res.status(200).json(booking)
//     } catch (error) {
//         console.log("Error in admin status update controller", error.message);
//         res.status(500).json({message : "Internal server error"})
//     }
// }

// export const userBookingUpdate = async (req, res) => {
//     try {
//         const {id} = req.params

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({message : "Invalid Id"})
//         }

//         const bookingUpdate = await Booking.findByIdAndUpdate(id, req.body, {new :true})
//         if(!bookingUpdate) {
//             return res.status(400).json({message : ""})
//         }
//         res.status(200).json(bookingUpdate)
//     } catch (error) {
//         console.log("Error in user booking update controller", error.message);
//         res.status(500).json({message : "Internal server error"})
//     }
// }