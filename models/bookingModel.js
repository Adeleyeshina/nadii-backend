import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    email : {
        type : String
    },
    service : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
    time : {
        type : String,
        required : true
    },
    note : String,
}, {timestamps : true})

const Booking = mongoose.model("booking", bookingSchema)

export default Booking