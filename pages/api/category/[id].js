import Categories from "../../../models/categoryModel";
import Products from "../../../models/productModel";
import connectdb from "../../../config/connectdb";
import { auth } from "../../../middleware/auth";


connectdb();
export default async function handler(req,res){
    switch(req.method){
        case 'PUT':
            await UpdateCategory(req,res)
        break;
        case 'DELETE':
            await deleteCategory(req,res)
        break;
    }
}

const UpdateCategory=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if (result.role!== 'admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        const {id} = req.query
        const {name} = req.body
        
        const category = await Categories.findOneAndUpdate({_id:id},{
           name
        })
        return res.json({
            msg: 'Update Success!',
            category 
        })

    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const deleteCategory=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if (result.role!== 'admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        const {id} = req.query
        const product = await Products.findOne({category:id})
        if(product){
            return res.status(400).json({error: "Please delete all products with a relationship"})
        }
        await Categories.findOneAndDelete({_id:id})
        return res.json({
            msg: 'Delete Success!'
        })

    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}