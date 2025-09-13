const Video = require('../models/Video');
const Season = require('../models/Season');
const User = require('../models/User')
const mongoose = require('mongoose')
const { deleteFile } = require('../utils/s3')
const safeTrim = require('../utils/safeTrim')

const getVideo = async (req, res) => {
    const { videoid } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(videoid)) {
            return res.status(400).json({ error: 'Invalid video ID' });
        }
        const video = await Video.findById(videoid).populate('majorField', 'name').populate('uploader', 'name')
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createVideo = async (req, res) => {
    const title = safeTrim(req.body.title);
    const description = safeTrim(req.body.description);
    const majorField = safeTrim(req.body.majorField);
    const seasonId = req.params.seasonId
    const userId = req.user.id
    try {

        if (!req.files['video']) return res.status(400).json({ error: 'you must upload a video' });
        if (!title || !description || !majorField) {
            await deleteFile(req.files['video'][0].location)
            if (req.files['pdf']) await deleteFile(req.files['pdf'][0].location);
            return res.status(400).json({ error: 'Title, description, and major field are required' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const season = await Season.findById(seasonId).populate('courseId','publisher');
        if (!season) {
            return res.status(404).json({ error: 'Season not found' });
        }
        if (user._id.toString() !== season.courseId.publisher.toString()) {
            return res.status(403).json({ error: 'You are not authorized to create a video for this season' });
        }
        const videoUrl = req.files['video'][0].location;
        const PDFUrl = req.files['pdf'] ? req.files['pdf'][0].location : null;
        const newVideo = new Video({ title, description, url: videoUrl, majorField, PDFUrl, seasonId: season._id });
        await newVideo.save();
        season.videos.push(newVideo._id);
        await season.save();
        res.status(201).json({ message: 'video uploaded successfully' });
    } catch (err) {
        try {
            if (req.files?.['video']) await deleteFile(req.files['video'][0].location);
            if (req.files?.['pdf']) await deleteFile(req.files['pdf'][0].location);
        } catch (cleanupErr) {
            console.error("File cleanup error:", cleanupErr.message);
        }
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const likedVideo = async (req, res) => {
    const videoid = req.params.videoid
    const userId = req.user.id
    try {
        if (!mongoose.Types.ObjectId.isValid(videoid)) {
            return res.status(400).json({ message: 'Invalid video ID' })
        }
        const video = await Video.findById(videoid)
        if (!video) {
            return res.status(404).json({ message: 'Video not found' })
        }
        const isLiked = video.likes.some(e => e.equals(userId))
        if (isLiked) {
            video.likes = video.likes.filter(e => !e.equals(userId))
        } else {
            video.likes.push(userId)
        }
        await video.save()
        res.status(200).json({
            message: isLiked ? 'liked removed' : 'liked successfully',
            likedCount: video.likes.length
        })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message })
    }
}
const deleteVideo = async (req, res) => {
    const videoid = req.params.videoid
    try {
        const video = await Video.findById(videoid)
        if (!video) {
            return res.status(404).json({ message: 'video not found' })
        }
        await deleteFile(video.url)
        if (video.PDFUrl) {
            await deleteFile(video.PDFUrl)
        }
        await video.deleteOne()
        res.json({ message: 'video deleted succefully' })
    } catch (e) {
        res.status(500).json({ message: 'Internal server error', error: e.message })
    }
}
module.exports = {
    getVideo,
    createVideo,
    likedVideo,
    deleteVideo
};