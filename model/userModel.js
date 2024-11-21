const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      phone:{
        type:String,
        required:true
      },
      isAdmin: {
        type: Boolean,
        default: 0,
      },
      profileImage: {
        type: String,
      },
})

const User = mongoose.model("users",userSchema)

module.exports= User