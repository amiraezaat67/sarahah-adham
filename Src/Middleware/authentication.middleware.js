import { verifyToken } from "../Utils/Token.utils.js";
import BlacklistedTokens from "../DB/Models/black-listed-tokens.model.js";
import User from "../DB/Models/user.model.js";


export const authenticationMiddleware = async (req,res,next) => {
    const {authorization:accesstoken} = req.headers;
    if (!accesstoken){
        return next(new Error('No access token found' , {cause:400}));
    }

    /**
     * @commet : remove the commented code 
     */
    // if (!accesstoken.startsWith(process.env.JWT_PREFIX)){
    //     return next(new Error('Invalid access token' , {cause:400}));
    // } 
    // const token = accesstoken.split(" ")[1] 
    const [prefix ,token] = accesstoken.split(" ")
    /**
     * @commet : remove the prefix if you don't need it
     * const [__ ,token] = accesstoken.split(" ")
     */
    

    const decodedData = verifyToken(token,process.env.JWT_SECRET_ACCESS);
    if (!decodedData){
        return next(new Error('Invalid access token' , {cause:400}));
    }

    //----- check if blacklisted
    const blacklistedToken = await BlacklistedTokens.findOne({tokenId:decodedData.jti});
    if(blacklistedToken){
        return next(new Error('User is blacklisted' , {cause:400}));
    }

    // get user data from DB
    const user = await User.findById(decodedData?.id);
    if(!user){
        return next(new Error('User not found' , {cause:400}));
    }

    /**
     * @commet : the user object here will  hold the returned document from the DB so if we need to get the
        id of the user in any place we can get it from [_id] field not [id] so, const {_id} = req.loggedInUser.user
     */ 
    req.loggedInUser = {user,token: { tokenId: decodedData.jti, expiresAt: decodedData.exp }};

    next();
}
