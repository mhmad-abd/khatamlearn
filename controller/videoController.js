const Video = require('../models/Video');
const mongoose = require('mongoose')

const getVideo = async (req, res) => {
    const { videoid } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(videoid)) {
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
        if (!title || !description || !genre) return res.status(400).json({ error: 'Title, description, and genre are required' });

        const videoUrl = req.files['video'][0].location;
        const PDFUrl = req.files['pdf'] ? req.files['pdf'][0].location : null;
        const newVideo = new Video({ title, description, url: videoUrl, uploader: user.id, genre, PDFUrl });
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error',error: err.message });
    }
};

module.exports = {
    getVideo,
    createVideo
};