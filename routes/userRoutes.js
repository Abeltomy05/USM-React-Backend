const express = require("express");
const userRoute = express.Router();
const {signup,login,getUserData,logoutUser,updateUser} = require("../controller/userController")
const userAuth = require('../middleware/userAuth')

const { upload } = require("../multer/multer"); 

userRoute.post("/signup", upload.single("image"), signup);
userRoute.post("/login",login);
userRoute.get('/:id',getUserData);
userRoute.put('/update',userAuth.verifyUser,upload.single("image"),updateUser)
userRoute.post("/logout",userAuth.verifyUser,logoutUser)

module.exports = userRoute

