import Products from "../../../models/productModel";
import connectdb from "../../../config/connectdb";
import { auth } from "../../../middleware/auth";


connectdb();

export default async function handler(req,res){
   switch(req.method){
       case 'GET':
           await getProduct(req,res)
        break;
        case 'PUT':
           await updateProduct(req,res)
        break;
        case 'DELETE':
           await deleteProduct(req,res)
        break;
   }
} 

const getProduct=async(req,res)=>{
    try {
        const {id} = req.query
       const product = await Products.findById({_id:id})
       return res.status(200).json({
           status : 'success fetching data',
           product
       })
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const updateProduct=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if(result.role!=='admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        
        const {id} = req.query

        const { title,price,inStock,category,decription,content,images } = req.body
        
        if(!title||!price||!inStock||category==='all'||!decription||!content||images.length===0)
            return res.status(400).json({error:'Please add all fields'})

        await Products.findByIdAndUpdate({_id:id},{
            title:title.toLowerCase(),price,inStock,category,decription,content,images
        })

        return res.status(201).json({
            msg: 'Success! updated product',

        })
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const deleteProduct=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if(result.role!=='admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        const {id} = req.query
       const product = await Products.findByIdAndDelete(id)
       return res.status(200).json({
           msg : 'Success! deleted product'
       })
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}