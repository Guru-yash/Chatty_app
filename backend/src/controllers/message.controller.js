
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

//get all the users except the current user
export const getUsersForSidebar= async(req,res)=>
{
    try 
    {
        //get the user id 
        const loggedInUserId = req.user._id;
        //give all users other than current user
        // make sure to remove the password from fetch
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
        
    } 
    catch (error) 
    {
        console.log("Error in message controller",error.message);
        res.status(500).json({error:"Internal server error"});
    }

};

//get message between sender and receiver
export const getMessages=async(req,res)=>
{
    try 
    {
        const { id:userTochat } = req.params; //get receiver id
        const myId = req.user._id; //get user id

        //get all messages between them
        const messages = await Message.find(
        {
            //message from (S to R) or (R to S)
            $or:[{senderId:myId,receiverId:userTochat},
                {senderId:userTochat,receiverId:myId}]

        });
        //send all messages to frontend
        res.status(200).json(messages);
    } 
    catch (error) 
    {
        console.log("Error in getMessage",error.message);
        return res.status(500).json({message:"Internal error"});
    }
    
};

//send message from sender to receiver
export const sendMessage=async(req,res)=>{
    try 
    {
        const {text,image} = req.body; //get message
        const {id: receiverId} = req.params; //get receiver
        const senderId = req.user._id; //get sender

        let imageURL;

        //if user sends an image then upload it to cloudinary
        if(image)
        {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image:imageURL,
        });

        await newMessage.save();

        // real time 
        const receiverSocketId = getReceiverSocketId(receiverId);
        //if user online send msg in real time
        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        res.status(201).json(newMessage);
    } 
    catch (error) 
    {
        console.log("Error in sendMessage",error.message);
        res.status(501).json({error : "Internal server error"});
    }
};