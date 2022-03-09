import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim : true
    }
},{
    timestamps:true
})

const Dataset =mongoose.models.categories || mongoose.model('categories',categorySchema) 

export default Dataset