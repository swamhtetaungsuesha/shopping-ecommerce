import Users from "../../../models/userModel";
import bcrypt from "bcryptjs";
import connectdb from "../../../config/connectdb";
import { createAccessToken, createRefreshToken } from "../../../utils/generateToken";


connectdb();

export default async function handler(req,res){
   switch(req.method){
       case 'POST':
           await login(req,res);
        break;

   }
} 

const login=async(req,res) =>{
    try {
        
        const {email,password} = req.body
        const user = await Users.findOne({email})
        if(!user) {
            return res.status(400).json({error:'User does not exists.'})
        }
        

        const isMatch =await bcrypt.compare(password,user.password)

        if(!isMatch) {
            return res.status(400).json({error:'Incorrect password!'})
        }
        
        const access_token = createAccessToken({id:user._id})
        const refresh_token = createRefreshToken({id:user._id})

        return res.json({
            msg: "Login Success!",
            access_token,
            refresh_token,
            user:{
                name: user.name,
                email: user.email,
                role: user.role,
                root: user.root,
                avatar: user.avatar
            }
        })
    } catch (err) {
        return res.status(500).json({error:err.message})
    }
}

