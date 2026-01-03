import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utilis.js";
import cloudinary from "../lib/cloudinary.js";

export const signIn = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if(!fullName || !email || !password){
      return res.status(400).json({message:"All fields required."})
    }
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
        await newUser.save();
      generateToken(newUser._id, res);
     
      
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);

    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const loginUser = async (req, res) => {
 const {email,password}= req.body
 try {
    const emailPresent = await User.findOne({email})
 if(!emailPresent){
    return res.status(400).json({message:"Email not existed"})
 }
 const isPasswordMatched=await bcrypt.compare(password,emailPresent.password)
 if(!isPasswordMatched){
    return res.status(400).json({message:"Invalid credentails"})
 }
 generateToken(emailPresent._id,res)
 res.status(200).json({
    _id:emailPresent._id,
    fullName:emailPresent.fullName,
    email:emailPresent.email,
    profilePic :emailPresent.profilePic
 })
 } catch (error) {
    console.log("Error in login controller",error.message);
    res.status(500).json("Internal Server Error")
    
 }

};

export const logout = (req, res) => {
try {
     res.cookie("jwt","",{
        maxAge:0
     })
     res.status(200).json({message:"Logged out successfully"})
} catch (error) {
    console.log("Error in logout controller",error.message);
    res.status(500).json({message:"Internal Server Error"})
    
}
};


export const updateProfile =async (req,res)=>{

  try {
    const {profilePic} = req.body;
    const userId = req.user._id
    if(!profilePic){
      return res.status(400).json({message:"Profile Pic is required"})
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
    res.status(200).json(updatedUser)

  } catch (error) {
        console.log("Error in update controller",error.message);
    res.status(500).json({message:"Internal Server Error"})
  }
}

export const checkAuth =  (req,res)=>{
  try {
     if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(req.user)
  } catch (error) {
    
    console.log("Error in checkAuth",error.message);
    res.status(500).json({message:"Internal Server Error"})
    
  }
}