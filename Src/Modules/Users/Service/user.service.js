import User from "../../../DB/Models/user.model.js";
import { asymmtetricDecrypt, asymmtetricEncrypt } from "../../../Utils/encryption.utils.js";
import bcrypt from "bcrypt";
import { compareSync } from "bcrypt";
import { sendEmail } from "../../../Utils/send.email.utils.js";
import { generateToken,verifyToken} from "../../../Utils/Token.utils.js";
import { customAlphabet} from "nanoid";
const uniquestring = customAlphabet("151841512858484565825985", 5);
import { eventEmitter } from "../../../Utils/send.email.utils.js";
import { v4 as uuidv4 } from "uuid";
import BlacklistedTokens from "../../../DB/Models/black-listed-tokens.model.js";
import mongoose from "mongoose";
import Messages from "../../../DB/Models/message.model.js";



// ------------------ SIGNUP ------------------
export const signup = async (req, res) => {
    const { firstName, lastName, age, gender, email, password, phoneNumber } = req.body;

    // Check if email OR same first+last name exists
    const isEmailExist = await User.findOne({ 
        $or:[
            {email},
            {firstName ,lastName}, 
        ]
    });
    if(isEmailExist){
        return res.status(409).json({ message:"Email already exists" });
    }

    // Check phone number
    const isPhoneNumberExist = await User.findOne({phoneNumber})
    if(isPhoneNumberExist){
        return res.status(409).json({ message:"Phone number already exists" });
    } 

    // Hash password + encrypt phone number
    const hashedPassword = bcrypt.hashSync(password,+process.env.SALT_ROUNDS)
    const encryptedPhoneNumber = asymmtetricEncrypt(phoneNumber)

    // Generate OTP
    const otp = uniquestring()
        
    // Send email with OTP
    eventEmitter.emit("emailSent", {
        to:email,
        subject:"confirmation email",
        content : `<h1>otp confirmation ${otp}</h1>`,
        attachments:[
            {
                filename:"cry.png.jpg",
                path:"cry.png.jpg"
            }
        ]
    })
        
    // Create user
    const userinstance = new User({
        firstName,
        lastName,
        age,
        gender,
        email,
        password:hashedPassword,
        phoneNumber:encryptedPhoneNumber,
        otp:{confirmation:bcrypt.hashSync(otp,+process.env.SALT_ROUNDS)} // OTP hashed
    })

    await userinstance.save()
    res.status(201).json({ message:"User created successfully",userinstance });
}



// ------------------ CONFIRM OTP ------------------
export const confirmotp = async (req, res ,next) => {
    const {email,otp} = req.body;
    
    // Find unverified user
    const user = await User.findOne({email, isVerified:false})
    if (!user){
        return next(new Error('User not found or already verified' , {cause:400}));
    }

    // Compare OTP with hashed OTP
    const isOtpValid = compareSync(otp,user.otp?.confirmation)
    if (!isOtpValid){
        return next(new Error("Invalid otp"));
    }

    user.isVerified = true; // Mark as verified
    await user.save()
    res.status(200).json({ message:"User verified successfully",user });
}



// ------------------ UPDATE USER ------------------
export const update = async (req ,res,next) =>{
    console.log(req.loggedInUser)
    const {id} = req.loggedInUser
    const {firstName,lastName,age,gender,email,} = req.body;


    const user = await User.findByIdAndUpdate(
        id,
        {
            firstName,
            lastName,
            age,
            gender,
            email,
        },
        {
            new:true
        }
    )
    if (!user){
        return next(new Error('User not found' , {cause:400}));
    }
    
    res.status(200).json({ message:"User updated successfully" });
}



// ------------------ DELETE USER ------------------
export const deleteuser = async (req, res) => {
        // start session
        const session = await mongoose.startSession()
        req.session = session
        const { user: { id } } = req.loggedInUser
        console.log(id);
    
        // start transaction
        session.startTransaction()
    
        const deletedUser = await User.findByIdAndDelete(id, { session })
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" })
        }
    
        await Messages.deleteMany({ receiverId:id }, { session })
    
        // commit transaction
        session.commitTransaction()
        // end session
        session.endSession()
        // console.log(`The transaction is commited`);
    
        return res.status(200).json({ message: "User deleted successfully", deletedUser })
        
    }
    



// ------------------ LIST USERS ----------------
export const ListUserService = async (req ,res) =>{
    let users = await User.find().populate("Messages")
    // users = users.map(user => {
    //     return {
    //         ...user._doc, 
    //         phoneNumber:asymmtetricDecrypt(user.phoneNumber) // Decrypt phone number
    //     }
    // })

    return res.status(200).json({ message:"Users fetched successfully",users });
}



// ------------------ SIGNIN ------------------
export const Signin = async (req ,res) =>{
    const {email,password} = req.body;

    const userinstance = await User.findOne({email})
    if(!userinstance){
        return res.status(404).json({ message:"User not found" });
    }

    // Check password
    const isPasswordValid = compareSync(password,userinstance.password)
    if(!isPasswordValid){
        return res.status(401).json({ message:"Invalid email or password" });
    }
    
    // Generate token
    const accesstoken = generateToken(
        {id:userinstance._id,email:userinstance.email},
        process.env.JWT_SECRET_ACCESS,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            jwtid:uuidv4(),
        }
    )
    const refreshtoken = generateToken(
        {id:userinstance._id,email:userinstance.email},
        process.env.JWT_SECRET_REFRESH,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            jwtid:uuidv4(),
        }
    )


    res.status(200).json({ message:"User logged in successfully",accesstoken,refreshtoken });
}


//------------------logout---------------------
export const logout = async (req ,res) =>{

    const {token:{tokenId,expiresAt}, user:{id}} = req.loggedInUser;

    // convert expiration field to be in date
    await BlacklistedTokens.create({
        tokenId,
        expiresAt:new Date(expiresAt*1000),
        userId:id
    })
    
    res.status(200).json({ message:"User logged out successfully" });

}


export const refreshToken = async (req ,res) =>{
    const {refreshtoken} = req.headers;

    const decodedData = verifyToken(refreshtoken,process.env.JWT_SECRET_REFRESH);

    const accesstoken = generateToken(
        {id:decodedData.id,email:decodedData.email},
        process.env.JWT_SECRET_ACCESS,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
            jwtid:uuidv4(),
        }
    )
    res.status(200).json({ message:"User token refreshed successfully",accesstoken });

}




