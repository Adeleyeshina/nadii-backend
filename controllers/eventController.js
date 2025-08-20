import mongoose from "mongoose";
import Event from "../models/eventModel.js";
import cloudinary from "../lib/cloudinary.js";

// Get all events
export const allEvent = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        console.log("Error in all event controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Add a new event (with Cloudinary upload)
export const addEvent = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res
                .status(400)
                .json({ message: "The event image is required" });
        }

        // Upload image to Cloudinary (events folder)
        const result = await cloudinary.uploader.upload(image, {
            folder: "events",
        });

        const event = await Event.create({ image: result.secure_url });

        res.status(201).json(event);
    } catch (error) {
        console.log("Error in add Event controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete an event (and its Cloudinary image)
export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Delete image from Cloudinary if it exists
        if (event.image && event.image.startsWith("http")) {
            try {
                const publicId = getCloudinaryPublicId(event.image, "events");
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.log("Failed to delete event image from Cloudinary:", err.message);
            }
        }

        await Event.findByIdAndDelete(id);
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.log("Error in delete Event controller", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Utility: Extract Cloudinary public_id from URL
function getCloudinaryPublicId(url, folder) {
    const parts = url.split("/");
    const versionIndex = parts.findIndex((p) => p.startsWith("v"));
    const publicIdParts = parts.slice(versionIndex + 1);
    return `${folder}/` + publicIdParts.join("/").split(".")[0];
}
