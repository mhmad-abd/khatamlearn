require('dotenv').config
const {comparePass}=require('./../utils/hash')
const User= require('./../models/User')
const tokenGenerator = require('../utils/tokenGenerator')


const loginController = async (req,res)=>{
    const{UserID,password} = req.body
    try{
           const user= await User.findOne({UserID})
    if(!user){
        return res.status(401).json({message:'The entered UserID is incorrect.'})
    }
    const compare =await comparePass(password,user.password)
    if(!compare){
        return res.status(401).json({message:'The entered password is incorrect.'})
    }
    const token = tokenGenerator({id:user._id,UserID:user.UserID})
    res.cookie('token',token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict'
    })
    res.json({message:'successful login',
        user:{id:user._id,UserID:user.UserID,name:user.name}
    })
    }catch(e){
        res.status(500).json({error:e.message})
    }
}


module.exports= loginController