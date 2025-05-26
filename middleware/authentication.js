const jwt = require('jsonwebtoken')
require("dotenv").config();
const auth=(req, res, next)=> {
  try{
    const token=req.cookies.token
    if(!token){
      return res.status(401).json({message:'token not found!'})
    }
    const decode = jwt.verify(token,process.env.SECRET_KEY_JWT)
    req.user = decode
    next()
  }catch(e){
    res.status(401).json({error:'invalid token',details:e.message})
  }
}


module.exports = auth