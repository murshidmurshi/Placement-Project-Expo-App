const mongoose = require('mongoose')
const {Schema} = mongoose

const AdminSchema = new Schema({
    name:{
        type:String,
        required:false
    },
    phone:{
        type:Number,
        required:false
    },
    AdminId:{
        type:Number,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false
    },
    avtar:{
        type:String,
        required:false
    },
})

module.exports=mongoose.model("Admin",AdminSchema)
