import Users from "../../../models/userModel";
import connectdb from "../../../config/connectdb";
import { auth } from "../../../middleware/auth";


connectdb();
export default async function handler(req,res){
    switch(req.method){
        case 'PATCH':
            await UpdateInfor(req,res)
        break;
        case 'DELETE':
            await deleteUser(req,res)
        break;
    }
}

const UpdateInfor=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if (result.role!== 'admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        const {id} = req.query
        const {role} = req.body
        
        await Users.findOneAndUpdate({_id:id},{
           role
        })
        return res.json({
            msg: 'Update Success!'
        })

    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

const deleteUser=async(req,res)=>{
    try {
        const result = await auth(req,res)
        if (result.role!== 'admin'){
            return res.status(400).json({error:'Authentication is not valid.'})
        }
        const {id} = req.query
        
        await Users.findOneAndDelete({_id:id})
        return res.json({
            msg: 'Delete Success!'
        })

    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}