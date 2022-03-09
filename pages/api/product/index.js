import Products from "../../../models/productModel";
import connectdb from "../../../config/connectdb";
import { auth } from "../../../middleware/auth";


connectdb();

export default async function handler(req,res){
   switch(req.method){
       case 'GET':
           await getProducts(req,res)
        break;
        case 'POST':
           await createProduct(req,res)
        break;
   }
} 
class APIFeatures{
    constructor(query,queryString){
        this.query = query,
        this.queryString = queryString
    }
    filtering(){
        const queryObj = {...this.queryString}

        const excludeFields = ['page','sort','limit']
        excludeFields.forEach(el=>delete(queryObj[el]))
        
        if(queryObj.category!=='all')
        this.query.find({category:queryObj.category})

        if(queryObj.title!=='all')
        this.query.find({title:{$regex:queryObj.title}})

        this.query.find()

        return this
    }

    sorting(){
        if(this.queryString.sort){

            const sortBy = this.queryString.sort.split(',').join('')

            this.query= this.query.sort(sortBy)
        }else{
            this.query=this.query.sort('-createdAt')
        }
        return this
    }
    paginating(){
        const page = this.queryString.page*1 || 1
        const limit = this.queryString.limit * 1 || 3
        const skip =( page - 1 )* limit

        this.query = this.query.skip(skip).limit(limit)

        return this
    }
}
const getProducts=async(req,res)=>{
    try {
       const features =new APIFeatures(Products.find({}),req.query)
       .filtering().sorting().paginating()
       const products = await features.query
       return res.status(200).json({
           status : 'success fetching data',
           result : products.length,
           products
       })
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const createProduct=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if(result.role!=='admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        const { title,price,inStock,category,decription,content,images } = req.body
        
        if(!title||!price||!inStock||category==='all'||!decription||!content||images.length===0)
            return res.status(400).json({error:'Please add all fields'})

        const newProduct = await new Products({
            title:title.toLowerCase(),price,inStock,category,decription,content,images
        })

        await newProduct.save()
        return res.status(201).json({
            msg: 'Success! created a new product',

        })
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}
