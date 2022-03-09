import Orders from "../../../../models/orderModel";
import connectdb from "../../../../config/connectdb";
import { auth } from "../../../../middleware/auth";

connectdb();

export default async function handler(req,res){
    switch (req.method) {
        case 'PATCH':
            await setDelivered(req,res)
            break;
        
    }
}

const setDelivered=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if(result.role!=='admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        const {id} = req.query
        const order = await Orders.findOne({_id:id})
        if(order.payment){

            await Orders.findOneAndUpdate({_id:id},{
                delivered: true
            })
            return res.status(200).json({
                msg : 'Update success!',
                result:{
                    delivered : true,
                    method : order.method,
                    payment: true,
                    dateOfPayment : order.dateOfPayment
                }
            })
        }else{
            await Orders.findOneAndUpdate({_id:id},{
                payment: true,
                dateOfPayment: new Date().toISOString(),
                method : 'Receive Cash',
                delivered: true
            }) 
            return res.status(200).json({
                msg : 'Update success!',
                result:{
                    delivered : true,
                    method : 'Receive Cash',
                    payment: true,
                    dateOfPayment : new Date().toISOString()
                }
            })
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}