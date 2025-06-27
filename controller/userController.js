const User = require("../models/User")
const { comparePass, hashingPass } = require("../utils/hash")
const tokenGenerator = require("../utils/tokenGenerator")


const getUsers= async (req, res) => {
    const userID = req.user.id
    try{
        const user = await User.findById(userID).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user) 
    }catch(e){
        res.status(500).json({message:'Server error',error:e.message})
    }
}



const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    })
    res.json({ message: 'Logout successful' })
}


const updateUser = async (req, res) => {
    const userID = req.user.id
    const { name, email } = req.body
    const updatedUser={}

    if(name) updatedUser.name =name
    if(email) updatedUser.email = email

    if(Object.keys(updatedUser).length === 0) {
        return res.status(400).json({ message: "No fields to update" })
    }

    try {
        const user = await User.findByIdAndUpdate(userID, updatedUser, { new: true }).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user)
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e.message })
    }
}



const deleteUser = async (req, res) => {
    const userID = req.user.id

    try {
        const user = await User.findByIdAndDelete(userID)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
        })
        res.json({ message: "User deleted successfully"})
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e.message })
    }
}



const login = async (req,res)=>{
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



const register =async (req,res)=>{
    try{
        const {name , UserID , password , email }=req.body
        if(!name || !UserID || !password || !email){
            return res.status(400).json({message:'Fill all fields'})
        }

        const exiting = await User.findOne({UserID})
        
        if(exiting){
            return res.status(409).json({ message: 'There is a user with this UserID' });
        }


        const hashedPass =await hashingPass(password)
        const newUser = new User({name,UserID,password:hashedPass,email})
        await newUser.save() 
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch(e){
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}



module.exports={
    getUsers,
    logout,
    updateUser,
    deleteUser,
    login,
    register
}