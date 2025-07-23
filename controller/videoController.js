const Video = require('../models/Video');
const mongoose = require('mongoose')
const { deleteFile } = require('../utils/s3')
const getVideo = async (req, res) => {
    const { videoid } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(videoid)) {
            return res.status(400).json({ error: 'Invalid video ID' });
        }
        const video = await Video.findById(videoid)
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createVideo = async (req, res) => {
    try {
        const { title, description, genre } = req.body;
        const user = req.user

        if (!req.files['video']) return res.status(400).json({ error: 'you must upload a video' });
        if (!title || !description || !genre) {
            await deleteFile(req.files['video'][0].location)
            if (req.files['pdf']) await deleteFile(req.files['pdf'][0].location);
            return res.status(400).json({ error: 'Title, description, and genre are required' });
        }

        const videoUrl = req.files['video'][0].location;
        const PDFUrl = req.files['pdf'] ? req.files['pdf'][0].location : null;
        const newVideo = new Video({ title, description, url: videoUrl, uploader: user.id, genre, PDFUrl });
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (err) {
        if (req.files?.['video']) await deleteFile(req.files['video'][0].location);
        if (req.files?.['pdf']) await deleteFile(req.files['pdf'][0].location);
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