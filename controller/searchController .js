const Video = require('../models/Video')
const User = require('../models/User')

const searchController = async (req, res) => {
    const { q } = req.query
    if (!q || q.trim() === '') {
        return res.json({ videos: [], users: [] });
    }
    try {
        const videos = await Video.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        })
        const users = await User.find({ name: { $regex: q, $options: 'i' }, role: 'teacher' })
        res.json({ videos, users })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

module.exports = searchController  