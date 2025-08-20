import mongoose from 'mongoose'

const eventScehema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Event = mongoose.model('Event', eventScehema)

export default Event;