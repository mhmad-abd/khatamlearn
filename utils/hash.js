const bcrypt = require('bcryptjs')


const hashingPass = async (password)=>{
    const hashed = await bcrypt.hash(password,10)
    return hashed;
}


const comparePass = async (password , hashedPass)=>{
    return await bcrypt.compare(password,hashedPass);
}



module.exports={
    hashingPass,
    comparePass
};