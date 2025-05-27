const Comment = require('./../models/Comment')


const getComments = async(req,res)=>{
    const videoid = req.params.videoid
    try{
        const comments = await Comment.find({videoID:videoid,parnetID:null}).populate('userID','name')
        res.json(comments)
    }catch(e){
        res.status(500).json({error:e.message})
    }
}

const newComment = async (req,res)=>{
    const videoid = req.params.videoid
    try{
        newCom= new Comment({
            content:req.body.content,
            videoID:videoid,
            userID:req.user.id
        })
        await newCom.save()
        res.status(201)
    }catch(e){
        res.status(500).json({error:e.message})
    }
}






module.exports={
    getComments,
    newComment
}