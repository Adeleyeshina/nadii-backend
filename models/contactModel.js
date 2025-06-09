import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    email : String,
    
    subject : String,

    message : {
        type : String,
        required : true
    }
},
{timestamps : true}
)

const Contact = mongoose.model("contact", contactSchema)

export default Contact