import Users from "../../../models/userModel";
import connectdb from "../../../config/connectdb";
import { auth } from "../../../middleware/auth";
import bcrypt from "bcryptjs";

connectdb();
export default async function handler(req,res){
    switch(req.method){
        case 'PATCH':
            await resetPassword(req,res)
        break;
    }
}

const resetPassword=async(req,res)=>{
    try {
        const result = await auth(req,res)
        const {password} = req.body
        const passwordHash = await bcrypt.hash(password,12)
        await Users.findOneAndUpdate({_id:result.id},{
            password : passwordHash
        })
        return res.json({
            msg: 'Update Success!',

        })

    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}