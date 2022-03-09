import Orders from "../../../models/orderModel";
import Products from "../../../models/productModel";
import connectdb from "../../../config/connectdb";
import { auth } from "../../../middleware/auth";

connectdb();

export default async function handler(req,res){
    switch (req.method) {
        case 'POST':
            await createOrder(req,res)
            break;
        case 'GET':
            await getOrders(req,res)
            break;
    }
}

const getOrders=async(req,res)=>{
    try {
        const result = await auth(req,res)
        let orders;
        if(result.role!=='admin'){
            orders = await Orders.find({user:result.id}).populate('user','-password')
        }else{
            orders = await Orders.find().populate('user','-password')
        }
        
        
        return res.json({
            msg : 'success data fetching',
            orders
        })
        
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const createOrder=async(req,res)=>{
    try {
        const result = await auth(req,res)

        const {address,mobile,cart,total} = req.body
        for(let item of cart) {
            await sold(item._id,item.quantity,item.inStock,item.sold)
        }
        const newOrder = await new Orders({
            user: result.id,address,mobile,cart,total
        })
        await newOrder.save()
        return res.status(201).json({
            msg: 'Order success! We will contact you to comfirm the order',
            newOrder
        })
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const sold =async (id,quantity,oldInStock,oldSold) => {
    await Products.findOneAndUpdate({_id:id},{
        inStock: oldInStock-quantity,
        sold : oldSold+quantity
    })
}