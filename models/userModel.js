import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type:String,
        default:'user'
    },
    root:{
        type:Boolean,
        default:false
    },
    avatar:{
        type:String,
        default:'https://www.seekpng.com/png/small/41-410093_circled-user-icon-user-profile-icon-png.png'
    }
},{
    timestamps:true
})

const Dataset =mongoose.models.users || mongoose.model('users',userSchema) 

export default Dataset