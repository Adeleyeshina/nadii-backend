import User from "../models/userModel.js";
import redis from '../lib/redis.js'
import jwt from 'jsonwebtoken'
import generateCode from '../lib/genCode.js'
import {generateToken, setCookies} from '../lib/tokenAndCookiesGenerate.js'
import bcrypt from "bcryptjs";
import {accountActivationEmail} from "../lib/nodemailer.js";

export const signup = async(req, res) => {
    try {
        const {email, password, name} = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({message : "Input all the info"})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"})
        } 

        if (password.length < 6) {
            return res.status(400).json({message : "Password cannot be less than 6 characters"});
        } 
        
        const emailExist = await User.findOne({email});
        if(emailExist) {
            return res.status(400).json({message : "User already exist"})
        }
        const verificationCode = generateCode()
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = User ({
            name,
            email,
            password,
            verificationToken : verificationCode,
            password : hashedPassword
        })
        if(newUser) {           
            try {
                await accountActivationEmail(newUser.email, verificationCode, name, "Activate your account", "signup")
            } catch (error) {
                console.log("Error sending message", error.message)
                return res.status(400).json({message : "Error sending message"})
            }
             await newUser.save()
            return res.status(201).json({
                message : "Check your email to verify account",
                name,
                email,
            })
        }
    } catch (error) {
        console.log('Error in sign up controller', error.message);
        return res.status(500).json({message : 'Internal Server Error'})
        
    }
}
export const verify = async(req, res) => {
    try {
        
        const token = req.params.token;
        const user = await User.findOne({verificationToken : token})
        if(!user) {
           return res.status(404).json({success : false, message : "Invalid or expired verification token" })
        }
        user.isVerified = true,
        user.verificationToken = null;
        await user.save()
        return res.status(200).json({success : true,
            message : "Account activated succesfully"})
    } catch (error) {
        console.log('Error in email verification controller', error);
        res.status(500).json({message : 'Internal Server Error'})
    }
}
export const login = async(req, res) => {
   try {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message : "Please input all the field"})
    }

    const user = await User.findOne({email})
    if(!user)  return res.status(404).json({message : 'User not found'})

    const isPassword = await bcrypt.compare(password, user?.password || '')

    if(user.isVerified === false) {
        return res.status(400).json({message : "You don't have access please activate your account"})
    }
    if(user && isPassword && user.isVerified) {
        const {accessToken, refreshToken } = generateToken(user._id)
        try {
            await redis.set(`refresh_token:${user._id}`, refreshToken, "EX", 7*24*60)
        } catch (error) {
            console.log("Error in sending token to redis in login controller", error.message);
            
        }

        setCookies(res, accessToken, refreshToken)
        return res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            firstname : user.firstname,
            lastname : user.lastname,
            phone : user.phone,
        })
    }
    res.status(400).json({message : "Invalid username or password"})
   } catch (error) {
    console.log('Error in login controller', error);
    res.status(500).json({message : 'Internal Server Error'})
   }
}
export const logout = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token:${decoded.userId}`)
        }
        res.clearCookie("accessToken", {
            httpOnly : true,
            sameSite : 'None',
            secure: true,
        })
        res.clearCookie("refreshToken", {
            httpOnly : true,
            sameSite : 'None',
            secure: true,
        })
        res.status(200).json({message : "Logout Succesful"})
    } catch (error) {
        console.log('Error in logout controller', error);
        res.status(500).json({message : 'Internal Server Error'})
    }
}

export const updateAccountInfo = async (req, res) => {
    try {
        const {firstname, lastname, email, phone} = req.body
        if (!firstname || !lastname || !email || !phone) {
            return res.status(400).json({message : "All the fill all the form"})
        }
        
        const user = await User.findById(req.user._id) 
        if(!user) {
            return res.status(404).json({message : "User not found"})
        }

        if(req.user.email !== email) {
            const userExist = await User.findOne({email}) 
            if(userExist) {
                return res.status(400).json({message : "There's an account with the email"})
            }
        }
        
        const updatedInfo = await User.findByIdAndUpdate(req.user._id, req.body, {new : true}).select("-password")
        if(!updatedInfo) {
            return res.status(400).json({message : "Error updating user info"})
        }
        res.status(200).json({message : "Info updated succesfully", 
                    name : updatedInfo.name,
                    email : updatedInfo.email,
                    role : updatedInfo.role,
                    firstname : updatedInfo.firstname,
                    lastname : updatedInfo.lastname,
                    phone : updatedInfo.phone,
        })
    } catch (error) {
        console.log('Error in update account controller', error);
        res.status(500).json({message : 'Internal Server Error'})
    }
}

export const forgetPassword = async(req, res) =>{
    try {
        const email = req.body.email
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const verificationCode = generateCode()

        user.verificationToken = verificationCode;
        await user.save()
        try {
            await accountActivationEmail(email, verificationCode, user.name, "Reset password", "reset")
        } catch (error) {
            console.log("Error in sending message in forget password controller", error.message);
            return res.status(400).json({message : "Error sending message"})
            
        }
        
        res.status(200).json({message: "reset code sent to your email"})
    } catch (error) {
        console.log('Error in forget password controller', error);
        res.status(500).json({message : 'Internal Server Error'})
    }
}

export const resetPassword = async(req, res) =>{
    try {
        const {token} = req.params;
        const { password}= req.body;
        if(password?.length < 6) {
            return res.status(400).json({message : "Password length cannot less than 6 "})
        }
        const user = await User.findOne({verificationToken : token});
        if(!user) {
            return res.status(404).json({message : "Invalid or expired token"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        user.verificationToken = null
        user.password = hashedPassword;
        await user.save()
        res.status(200).json({message : 'Password reset successfully'})
    } catch (error) {
        console.log('Error in reset password controller', error);
        res.status(500).json({message : 'Internal Server Error'})
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {
            return res.status(401).json({message : "No refresh token provided"})
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`)
        if(storedToken !== refreshToken) {
            return res.status(401).json({message: 'Invalid resfresh token'})
        }
        const accessToken = jwt.sign({userId: decoded.UserId}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : "15m"
        })
        res.cookie ("accessToken", accessToken, {
            httpOnly : true,
            sameSite : 'None',
            secure : true,
            maxAge : 15 * 60 *1000
        })
        res.json({message : "Token refresh succesfully"})
    } catch (error) {
        console.log('Error in refresh token controller', error);
        res.status(500).json({message : 'Internal Server Error'})
    }
}

export const getProfile = async(req, res)=> {
    try {
        const user = await User.findById(req.user._id)

     res.status(200).json({
        _id : user._id,
        name : user.name,
        role : user.role,
        email : user.email,
        firstname : user.firstname,
        lastname : user.lastname,
        phone : user.phone,
     })
    } catch (error) {
        console.log('Error in getProfile controller', error);
        res.status(500).json({message : 'Internal Server Error'})
    }
}
