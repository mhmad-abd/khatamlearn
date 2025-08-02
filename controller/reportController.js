const Report = require('../models/Report')

const createReport = async (req, res) => {
    const videoId = req.params.videoid
    const userId = req.user.id
    const { reason } = req.body
    try {
        const report = new Report({video:videoId,user:userId,reason})
        await report.save()
        res.status(201).json({ message: 'Report created successfully', report })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message })
    }
}
const getReports = async (req, res) => {
    try {
        const reports = await Report.find({status:'pending'}).populate('user', 'username').populate('video', 'title')
        res.status(200).json({ reports })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message })
    }
}

module.exports = {
    createReport,
    getReports
}