const Video = require('./../models/Video')


const serachController= async (req,res)=>{
    const {q} = req.query
    try{
        const videos =await Video.find({$or:[
        {title:{ $regex: q , $options:'i'}},
        {description:{ $regex: q , $options:'i'}}
    ]});
    res.json(videos)
    }catch(e){
        res.status(500).json({error:e.message})
    }
}

module.exports = serachController