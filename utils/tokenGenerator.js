const jwt =require('jsonwebtoken')
module.exports = tokenGenerate= (user)=>{
    return jwt.sign(user,process.env.SECRET_KEY_JWT)
}