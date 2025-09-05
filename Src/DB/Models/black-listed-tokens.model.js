
import mongoose from "mongoose";

const blacklistedTokensSchema = new mongoose.Schema({
    tokenId:{
        type:String,
        required:true,
        unique:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

})

const BlacklistedTokens = mongoose.model("BlacklistedTokens",blacklistedTokensSchema)
export default BlacklistedTokens