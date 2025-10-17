const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String ,required: true ,inque:true },
        password: { type: String,required: true },
        isAdmin: { type: Boolean,default :false, required: true },
        phone : {type : String} ,
        address : {type : String} ,
        avatar: { type: String },
        resetPasswordToken: { type: String },
        resetPasswordExpires :{type : String}
    },
     { 
        strict: false // Cho phép lưu các trường không được định nghĩa trong schema
      }
      ,
    {
        timestamps :true 
    }
)
const User = mongoose.model("User", userSchema)
module.exports =User