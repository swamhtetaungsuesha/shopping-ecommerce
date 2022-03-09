import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    category:{
        type: String,
        required: true,
        trim: true
    },
    content:{
        type: String,
        required: true,
        trim : true
    },
    checked:{
        type : Boolean,
        required: true,
        default: false
    },
    price:{
        type:Number,
        required:true
    },
    inStock:{
        type:Number,
        required:true
    },
    sold: {
        type:Number,
        default: 0
    },
    decription:{
        type:String,
        required:true
    },
    images:{
        type: Array,
        required:true
    }
},{
    timestamps:true
})

const Dataset =mongoose.models.products || mongoose.model('products',productSchema) 

export default Dataset