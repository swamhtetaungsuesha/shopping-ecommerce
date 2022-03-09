import Orders from "../../../../models/orderModel";
import connectdb from "../../../../config/connectdb";
import { auth } from "../../../../middleware/auth";

connectdb();

export default async function handler(req,res){
    switch (req.method) {
        case 'PATCH':
            await setPayment(req,res)
            break;
        
    }
}

const setPayment=async(req,res)=>{
    try {
        const result = await auth(req,res)
        const {id} = req.query
        const {paymentId} = req.body
        await Orders.findOneAndUpdate({_id:id},{
            payment: true,
            paymentId,
            method : 'Paypal',
            dateOfPayment : new Date().toISOString()
        })
        return res.status(200).json({
            msg : 'Payment success!'
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}