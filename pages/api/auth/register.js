import Users from "../../../models/userModel";
import { valid } from "../../../utils/valid";
import bcrypt from "bcryptjs";
import connectdb from "../../../config/connectdb";

connectdb();

export default async function handler(req,res){
   switch(req.method){
       case 'POST':
           await register(req,res);
        break;

   }
} 

const register=async(req,res) =>{
    try {
        
        const {name,email,password,cf_password} = req.body
        const user = await Users.findOne({email})
        if(user) {
            return res.status(400).json({error:'This email is already exists'})
        }
        const errmsg =await valid(name,email,password,cf_password)

        if(errmsg) {
            return res.status(400).json({error:errmsg})
        }

        const hashPassword =await bcrypt.hash(password,12)
        
        const newUser = new Users({
            name,email,password:hashPassword
        })
        await newUser.save()
        return res.status(201).json({msg:'Successfully created an account!'})
    } catch (err) {
        return res.status(500).json({error:err.message})
    }
}


