import jwt from 'jsonwebtoken'
import Users from "../models/userModel";

export const auth =async (req,res) => {
    const authHeader = req.headers['authorization']

    const [type,token] = authHeader.split(" ")
    if(!token) return res.status(400).json('Invalid Authorization')

    const decoded = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    if(!decoded) return res.status(400).json('Invalid Authorization')

    const result=await Users.findOne({_id: decoded.id})

    return {id: result._id,role:result.role,root:result.root}
}