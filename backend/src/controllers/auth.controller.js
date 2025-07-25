//import { use } from "react";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signup= async(req,res)=>{
    const{fullname, email, password}=req.body //fetches these data from signup
    try 
    {
        if(!fullname || !email || !password)
        {
            return res.status(400).json({message: "Enter all credentials"});
        }
        //check validity of password
        if(password.length < 6)
        {
            return res.status(400).json({message: "Password must be of 6 characters"});
        }   
        // check if email already exist
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Email exists"});

        //if all good then we are ready to add new user after hashing its password
        const salt=await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullname : fullname,
            email : email,
            password : hashedPass
        })

        if(newUser)
        {
            //generate token
            generateToken(newUser._id,res);

            await newUser.save(); //new user saved to the database

            //After the user is successfully registered, the backend sends back important user details in a structured JSON format so the frontend Show the user's info on the screen
            // 201 : A new resource (user) was successfully created
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilePic

            })
        }
        else{
            res.status(400).json({message: "Invalid credentials"});
            
        }
    } 
    catch (err) 
    {
        console.log("error in signup controller", err.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const login = async (req, res) => {
  const { email, password } = req.body; // fetch data

  try {
    const user = await User.findOne({ email }); // find user from DB

    if (!user) {
      return res.status(404).json({ message: "Invalid input, no such user exists" });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password); // check password

    if (!isCorrectPassword) {
      return res.status(404).json({ message: "Incorrect Password" });
    }

    generateToken(user._id, res); // attach token as cookie

    //if email and password correct then send data in json format from backend to frontend
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } 
  catch (error) 
  {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ message: "Internal error" });
  }
};


export const logout= async(req,res)=>
{
    try 
    {
        // clear cookie
        res.cookie("jwt","", {
            maxAge:0
        });
        res.status(200).json({message:"Logout success!!"});
    } 
    catch (error) 
    {
        console.log("Error in logout controller", error.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const updateProfile=async(req,res)=>
{
    try 
    {
        const {profilePic} = req.body; // get the profile pic

    const userId= req.user._id; //identify which user we are talking about

    if(!profilePic){
        req.status(401).json({message:"Profile pic required"});
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic); //upload image to cloudinary
    const updatedUser = await User.findByIdAndUpdate(userId,
        {profilePic:uploadResponse.secure_url},
        {new:true}
    );

    res.status(200).json(updatedUser);
        
    } catch (error) 
    {
        console.log("Error in update",error.message);
        res.status(500).json({message:"Internal error"});
        
    }

};

export const checkAuth=(req,res)=>
{
    try {
        res.status(201).json(req.user);
    } catch (error) {
        console.log("Error in check auth",error.message);
        res.status(500).json({message:"Internal error"});
    }

};