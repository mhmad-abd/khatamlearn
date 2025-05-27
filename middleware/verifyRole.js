const verifyRole = (req,res,next)=>{
    const user = req.user
    if(user.role == "teacher"){
        next()
    }
    else{
        return res.status(403).json({message:'You do not have permission to access'})
    }
}

module.exports = verifyRole