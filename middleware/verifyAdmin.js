require("dotenv").config();
const jwt = require('jsonwebtoken');
const User=require('../model/userModel');

verifyAdmin = async(req,res,next)=>{
    let token = req.cookies.token;
    
    if (token) {
      try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
       
        await User.findById(decode.id).select("-password"); // to get all details except password
        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        console.log("Not authorized, token failed");
        res.redirect('/login');
      }
    } else {
      res.status(401);
      console.log("Not authorized, no token");
      res.redirect('/login');
    }
 }
  


module.exports = {verifyAdmin}