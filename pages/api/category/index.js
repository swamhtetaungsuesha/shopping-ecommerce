import Categories from "../../../models/categoryModel";
import connectdb from "../../../config/connectdb";
import { auth } from "../../../middleware/auth";

connectdb();

export default async function handler(req,res){
    switch (req.method) {
        case 'POST':
            await createCategory(req,res)
            break;
        case 'GET':
            await getCategories(req,res)
            break;
    }
}

const getCategories=async(req,res)=>{
    try {
       
        const categories = await Categories.find()
        
        return res.json({
            msg : 'success data fetching',
            categories
        })
        
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const createCategory=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if(result.role!=='admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        const {name} = req.body
        
        const newCategory = await new Categories({
          name
        })
        await newCategory.save()
        return res.status(201).json({
            msg: 'Success! created a new category',
            newCategory
        })
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

