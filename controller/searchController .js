const Video = require('../models/Video')
const User = require('../models/User')
const Course = require('../models/Course')

const searchController = async (req, res) => {
    const { q } = req.query
    const limit = 15
    const page = parseInt(req.query.page) || 1
    const skip = (page - 1) * limit
    if (!q || q.trim() === '') {
        return res.json({ videos: [], users: [] });
    }
    try {
        const totalVideo = await Video.countDocuments({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        })
        const videos = await Video.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        const users = await User.find({ name: { $regex: q, $options: 'i' }, role: 'teacher' })
        res.json({ videos, users, currentPage: page, totalVideo, totalPages: Math.ceil(totalVideo / limit) })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

module.exports = searchController  