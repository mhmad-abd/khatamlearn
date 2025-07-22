const Comment = require('./../models/Comment')
const mongoose = require('mongoose')


const getComments = async (req, res) => {
    const videoid = req.params.videoid
    try {
        const comments = await Comment.find({ videoID: videoid, parentID: null })
            .populate('userID', 'name')
            .sort({ createdAt: -1 })
        res.json(comments)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

const newComment = async (req, res) => {
    const videoid = req.params.videoid
    try {
        const newCom = new Comment({
            content: req.body.content,
            videoID: videoid,
            userID: req.user.id
        })
        await newCom.save()
        res.status(201).json(newCom)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

const newReply = async (req, res) => {
    const videoID = req.params.videoid
    const parentID = req.params.commentID
    try {
        if (!mongoose.Types.ObjectId.isValid(videoID) || !mongoose.Types.ObjectId.isValid(parentID)) {
            return res.status(400).json({ message: 'invalid arguments' })
        }
        const newCom = new Comment({
            content: req.body.content,
            videoID,
            userID: req.user.id,
            parentID
        })
        await newCom.save()
        res.status(201).json(newCom)
    } catch (e) {
        res.status(500).json({ errorMessage: e.message })
    }
}

const getReplies = async (req, res) => {
    const parentID = req.params.commentID
    try {
        if (!mongoose.Types.ObjectId.isValid(parentID)) {
            return res.status(400).json({ message: 'Invalid comment ID' })
        }
        const replies = await Comment.find({ parentID })
            .populate('userID', 'name')
            .sort({ createdAt: -1 })
        res.json(replies)
    } catch (e) {
        res.status(500).json({ errorMessage: e.message })
    }
}



module.exports = {
    getComments,
    newComment,
    newReply,
    getReplies
}