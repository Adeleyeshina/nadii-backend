import mongoose from "mongoose";
import Contact from "../models/contactModel.js";
import { adminMessage } from "../lib/nodemailer.js";

export const allContactList = async (req, res) => {
    try {
        const contactList = await Contact.find({})
        res.status(200).json({length : contactList.length, contactList})
    } catch (error) {
        console.log("error in get contact controller", error.message);
        res.status(500).json({message : 'Internal Server Error'})
    }
}
export const singleContactList = async (req, res) => {
    try {
        const {id} = req.params
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message : "Invalid id"})
        }
        const contact = await Contact.findById(id)
        if(!contact) {
            return res.status(404).json({message : "Not found on the contact list"})
        }
        res.status(200).json(contact)
    } catch (error) {
        console.log("error in get contact controller", error.message);
        res.status(500).json({message : 'Internal Server Error'})
    }
}

export const sendContact = async (req, res) => {
    try {
        const {name, phone, message} = req.body;

        if (!name || !phone || !message ) {
            return res.status(400).json({message : "Please fill all the required field"})
        }
        const contact = JSON.stringify(req.body)
        try {
            await adminMessage("contact on your website", "Contacted", contact)
        } catch (error) {
            console.log("Error sending message", error.message)
            return res.status(400).json({message : "Error sending message please retry later or chat on whatsapp"})
        }
        await Contact.create(req.body)
        res.status(201).json({message : "Message sent"})
    } catch (error) {
        console.log("error in send contact controller", error.message);
        res.status(500).json({message : 'Internal Server Error'})
    }
}

export const deleteContact = async (req, res) => {
    try {
        const {id} = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message : 'Invalid contact Id'})
        }
        const contact = await Contact.findById(id)
        if(!contact) {
            return res.status(404).json({message : "The contact not in database"})
        }

        await Contact.findByIdAndDelete(id)

        return res.status(200).json({message : "Contact message deleted succesfully"})
    } catch (error) {
        console.log("error in delete contact controller", error.message);
        res.status(500).json({message : 'Internal Server Error'})
    }
}