const express = require("express");
const User = require("../model/userModel");
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
require("dotenv").config();

const securePassword = async (password) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
    }
  };

const adminLogin =async (req,res)=>{
    try{
        const {email,password} =req.body
        const adminInfo =await User.findOne({email})

        if(adminInfo?.isAdmin){
            if(await bcrypt.compare( password,adminInfo.password)){
                const token = jwt.sign({id:adminInfo._id},process.env.JWT_SECRET,{expiresIn:"30d"})

                res.cookie("token",token,{
                    httpOnly:true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    secure: false,
                    sameSite: 'lax',
                });

                return res.status(200).json({
                    message: "Login successful",
                    _id: adminInfo._id,
                    name: adminInfo.name,
                    password: adminInfo.password,
                    email :adminInfo.email,
                    phone :adminInfo.phone,
                    profileImage:adminInfo.profileImage
                  });
            }else{
                res.json("invalid password")
                console.log("admin password is wrong");   
            }
        }else{
            res.status(401).json({message:"No access"})
        }
    }catch(err){
       console.log(err);    
    }
}

const getData = async(req,res)=>{
    try{
        const users = await User.find({ isAdmin: false });
        res.json(users)
    }catch(err){
        console.log(err);
    }
}

const editUser = async(req,res)=>{
    try{
        const id = req.params.id
        const user = await User.findById(id)
        res.json(user)
    }catch(err){
        console.log("error occured in edit");
    }
}

const updateUser = async(req,res)=>{
    try{
        const {id,email,name,phone} = req.body
        const image = req.file ? `/uploads/${req.file.filename}` : null;
       
        let updatedData ={}
        const user = await User.findOne({ _id: id });
        if(!user){
            return res.status(404).json({message: "User not found" })
        }
        if(name){
            updatedData.name = name;
        }
        if(email){
            updatedData.email = email;
        }
        if(phone){
            updatedData.phone=phone;
        }
        if(image){
            updatedData.profileImage = image;
        }
        const updatedUser = await User.findByIdAndUpdate(id,updatedData)
        res.json({message:"Updation succes", updatedUser})

    }catch(err){
        console.log(err);   
    }
}

const createUser =async (req,res)=>{
    try{
        const {name,email,password,phone} = req.body
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const isEmailExists =await User.findOne({email})
        if(isEmailExists){
            res.status(409).json({ message: "User already exists" });
        }
        else{
            const passwordhash =await securePassword(password)
            const user = await User.create({
                name:name,
                profileImage: image,
                password:passwordhash,
                email:email,
                phone:phone
            })
            res.json(user)
        }
    }catch(err){
        console.log(err);
    }
}

const deleteUser = async(req,res)=>{
    try{
        const {id} = req.params
        const deletedUser = await User.findByIdAndDelete(id); 
        res.status(200).json({message: 'User deleted successfully' })
    }catch(err){
        console.log(err);   
    }
    }
const logoutAdmin = async(req,res)=>{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Set to true in production (HTTPS)
            sameSite: 'Lax',
          });
          res.status(200).json({ message: 'Logged out successfully' });
    }   

module.exports = {
    adminLogin,
    getData,
    editUser,
    deleteUser,
    logoutAdmin,
    updateUser,
    createUser
}