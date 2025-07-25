import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";


//next will lead to updateProfile if this section is done
export const protectRoute = async(req,res,next)=>
{
    try 
    {
        const token = req.cookies.jwt; //get the token

        //if no token found then
        if(!token) return res.status(401).json({message:"No token provided unauthorized user"});

        //if token exist then we compare it with our secret code present in env
        const decoded = jwt.verify(token,process.env.JWT_SECRET); 

        //if the value not matches with the secret token then wrong user
        if(!decoded)
        {
            return res.status(401).json({message:"No token provided unauthorized user"});
        }

        //if value matches then we get the user by its id
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({message:"No user"});
        }

        //if user is authenticated then we add user to the request and call next
        req.user=user;

        next();
    } 
    catch (error) 
    {
        console.log("Error in protect route",error.message);
        res.status(500).json({message:"Internal error"});   
    }

}