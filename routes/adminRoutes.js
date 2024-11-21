const express = require("express")
const adminRoute = express.Router()
const {adminLogin,getData,editUser,deleteUser,logoutAdmin,updateUser,createUser} = require("../controller/adminController")
const { upload } = require("../multer/multer");
const {verifyAdmin}=require('../middleware/verifyAdmin')

adminRoute.post('/login',adminLogin)
adminRoute.get('/data',verifyAdmin,getData)
adminRoute.get('/edituser/:id',verifyAdmin,editUser)
adminRoute.put('/update',verifyAdmin,upload.single("image"),updateUser)
adminRoute.post('/create',verifyAdmin,upload.single("image"),createUser)
adminRoute.delete('/delete/:id',verifyAdmin,deleteUser)
adminRoute.post("/logout",verifyAdmin,logoutAdmin)

module.exports = adminRoute;