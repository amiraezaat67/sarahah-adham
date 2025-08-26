

import mongoose from "mongoose";
import { GenderEnum } from "../../Common/enums/user.enum.js";
import { RoleEnum } from "../../Common/enums/user.enum.js";

const userschema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLingth:[3,"Too short"],
        maxlength:20,
        trim:true,
        lowercase:true,
        

    },
    lastName:{
        type:String,
        required:true,
        minLingth:[3,"Too short"],
        maxlength:20,
        trim:true,
        lowercase:true,
    },
    age:{
        type:Number,
        required:true,
        min:[18,"Too young"],
        max:[80,"Too old"],
        index:true,
    },
    gender:{
        type:String,
        required:true,
        enum:Object.values(GenderEnum),
        default:GenderEnum.MALE
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    otp:{
        confirmation:String,
        resetpassword:String,
    },
    isconfirmed:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        enum:Object.values(RoleEnum),
        default:RoleEnum.USER
    }
},{
    timestamps:true,
    toJSON:{
        virtuals:true,  
    },
    toObject:{
        virtuals:true,
    },
    virtuals:{
        fullName:{
            type:String,
            get(){
                return `${this.firstName} ${this.lastName}`
            }
        }
    },
    methods:{
        getfullName(){
            return `${this.firstName} ${this.lastName}`
        },
        getAge(){
            return this.age
        },
        
    }
})

userschema.index({firstName:1,lastName:1},{name:"idx_first_last_unique",unique:true})

userschema.virtual("Messages",{
    ref:"Message",
    localField:"id",
    foreignField:"receiverId"
})

const User =mongoose.model("User",userschema)
export default User
