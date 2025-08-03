const Report = require('../models/Report')

const createReportForVideo = async (req, res) => {
    const videoId = req.params.videoid
    const userId = req.user.id
    const { reason } = req.body
    try {
        const report = new Report({video:videoId,user:userId,reason,type:'video'})
        await report.save()
        res.status(201).json({ message: 'Report created successfully', report })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message })
    }
}
const createReportForComment = async (req, res) => {
    const commentId = req.params.commentid
    const userId = req.user.id
    const { reason } = req.body
    try {
        const report = new Report({comment:commentId,user:userId,reason,type:'comment'})
        await report.save()
        res.status(201).json({ message: 'Report created successfully', report })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message })
    }
}
const getVideoReports = async (req, res) => {
    try {
        const reports = await Report.find({status:'pending',type:'video'}).populate('user', 'username').populate('video', 'title')
        res.status(200).json({ reports })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message })
    }
}
const getCommentReports = async (req, res) => {
    try {
        const reports = await Report.find({status:'pending', type:'comment'}).populate('user', 'username').populate('comment', 'content')
        res.status(200).json({ reports })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message })
    }
}

module.exports = {
    createReportForVideo,
    createReportForComment,
    getVideoReports,
    getCommentReports
}