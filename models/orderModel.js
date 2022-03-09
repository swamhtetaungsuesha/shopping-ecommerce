import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user:{
        type : mongoose.Types.ObjectId,
        ref : 'users'
    },
    address : String,
    mobile : String,
    cart : Array,
    total : Number,
    delivered : {
        type : Boolean,
        default : false
    },
    paymentId: String,
    method : String,
    payment: {
        type : Boolean,
        default: false
    },
    dateOfPayment : Date
},{
    timestamps:true
})

const Dataset =mongoose.models.orders || mongoose.model('orders',orderSchema) 

export default Dataset