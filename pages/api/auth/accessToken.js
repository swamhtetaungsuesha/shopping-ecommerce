import Users from "../../../models/userModel";
import connectdb from "../../../config/connectdb";
import { createAccessToken, createRefreshToken } from "../../../utils/generateToken";
import jwt from 'jsonwebtoken'

connectdb();

export default async function handler(req,res){
   try {
       
       const  token= req.cookies.refresh_token

       if(!token){
           return res.status(400).json({error:'Please login now!'})
       }
      const result =await jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)

      if(!result) {
          return res.status(400).json({error:'Your token is not correct or expired'})
      }
      const user = await Users.findById({_id:result.id})

      if(!user) {
        return res.status(400).json({error:'User does not exist'})
      }

     const access_token= createAccessToken({id:user._id})

      return res.json({
          access_token,
          user:{
            name: user.name,
            email: user.email,
            role: user.role,
            root: user.root,
            avatar: user.avatar
        }
      })
   } catch (error) {
       return res.status(500).json({error:error.message})
   }
} 

