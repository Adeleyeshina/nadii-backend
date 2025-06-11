import mongoose from "mongoose";
import bcrypt, { genSalt }  from "bcryptjs";
const userSchema = new mongoose.Schema ({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minLength : 6
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    verificationToken : {
        type : String,
    },
    firstname : String,
    lastname : String,
    phone : String,
    cartItems : [
        {
            quantity : {
                type : Number,
                default : 1
            },
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Product'
            }
        }
    ],
    role : {
        type : String,
        enum : ['customer', 'admin'],
        default : 'customer'
    }
},
    {timestamps : true}
 )

const User = mongoose.model('User', userSchema);
export default User