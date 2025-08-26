import User from "../../../DB/Models/user.model.js";
import Message from "../../../DB/Models/message.model.js";

export const sendMessage = async (req,res) => {
    const {content} = req.body;
    const {receiverId} = req.params;

    const user = await User.findById(receiverId);
    if (!user){
        return res.status(404).json({ message:"User not found" });
    }
    
    const messageinstance = new Message({
        content,
        receiver:receiverId,
    })
    await messageinstance.save()
    
    res.status(200).json({ message:"Message sent successfully",messageinstance });
}



export const getMessages = async (req,res) => {
    const messages = await Message.find().populate([
        {
            path:"receiverId",
            select:"firstName lastName age"
            
        }
    ])
    res.status(200).json({ message:"Messages fetched successfully",messages });
}
