const User = require('./../models/User')
const hash = require('./../utils/hash')
const registerController =async (req,res)=>{
    try{
        const {name , UserID , password }=req.body
        if(!name || !UserID || !password){
            return res.status(400).json({message:'Fill all fields'})
        }

        const exiting = await User.findOne({UserID})
        
        if(exiting){
            return res.status(409).json({ message: 'There is a user with this UserID' });
        }


        const hashedPass =await hash.hashingPass(password)
        const newUser = new User({name,UserID,password:hashedPass})
        await newUser.save() 
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch(e){
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

module.exports = registerController