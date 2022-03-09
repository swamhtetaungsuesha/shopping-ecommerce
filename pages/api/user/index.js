import Users from "../../../models/userModel";
import connectdb from "../../../config/connectdb";
import { auth } from "../../../middleware/auth";
import bcrypt from "bcryptjs";

connectdb();
export default async function handler(req,res){
    switch(req.method){
        case 'PATCH':
            await UpdateInfor(req,res)
        break;
        case 'GET':
            await getUsers(req,res)
        break;
    }
}
const getUsers=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if (result.role!== 'admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        const users = await Users.find().select('-password')

        return res.status(200).json({
            msg : 'Success Data Fetching',
            users
        })

    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}
const UpdateInfor=async(req,res)=>{
    try {
        const result = await auth(req,res)
        const {name,avatar} = req.body
        
        const newUser=await Users.findOneAndUpdate({_id:result.id},{
            name,avatar
        })
        return res.json({
            msg: 'Update Success!',
            user:{
                name,
                avatar,
                email: newUser.email,
                role: newUser.role,
                root: newUser.root
            }
        })

    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}