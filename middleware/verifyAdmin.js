const verifyAdmin = (req,res,next)=>{
    const user = req.user
    if(user.role == "Admin"){
        next()
    }
    else{
        return res.status(403).json({message:'You do not have permission to access'})
    }
}

module.exports = verifyAdmin