const User = require("../models/User")

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

module.exports={
    getUsers,
    logout,
    updateUser,
    deleteUser
}