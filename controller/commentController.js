const Course = require('../models/Course')
const safeTrim = require('../utils/safeTrim')
const Comment = require('./../models/Comment')
const mongoose = require('mongoose')


const getComments = async (req, res) => {
    const courseId = req.params.courseId
    try {
        const comments = await Comment.find({ courseId: courseId, parentID: null })
            .populate('userID', 'name')
            .sort({ createdAt: -1 })
        res.json(comments)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

const newComment = async (req, res) => {
    const courseId = req.params.courseId
    const content = safeTrim(req.body.content)
    try {
        if(!content){
            return res.status(400).json({message:'Content is required'})
        }
        const newCom = new Comment({
            content: content,
            courseId: courseId,
            userID: req.user.id
        })
        await newCom.save()
        res.status(201).json(newCom)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

const newReply = async (req, res) => {
    const courseId = req.params.courseId
    const parentID = req.params.commentID
    try {
        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(parentID)) {
            return res.status(400).json({ message: 'invalid arguments' })
        }
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({message:'Course not found'})
        }
        const newCom = new Comment({
            content: req.body.content,
            courseId,
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