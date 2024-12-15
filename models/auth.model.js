const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
userId:{
    type:String,
    required:true,
    unique:true
},
emailId:{
    type:String,
    required:true,
    unique:true,
    trim:true
},
fullName:{
    type:String,
    trim:true
},
role:{
    type:String,
    enum:["user","admin"],
    default:"user"
},
avatar:{
    type:String
}
},
{
    timestamps:true
});

 const User = mongoose.model("User",userSchema);
 module.exports = User