const Season = require('../models/Season')
const Course = require('../models/Course')
const { default: mongoose } = require('mongoose')
const safeTrim = require('../utils/safeTrim')
const { deleteFile } = require('../utils/s3')
const Video = require('../models/Video')


const addSeason = async (req, res) => {
    const title = safeTrim(req.body.title)
    const courseId = req.params.courseId
    try {
        if (!title) {
            return res.status(400).json({ message: 'Title required' })
        }
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course id' })
        }
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: 'Course not found ' })
        }
        const newSeason = new Season({ title, courseId: course._id })
        await newSeason.save()
        course.seasons.push(newSeason._id)
        await course.save()
        res.status(201).json({ message: 'Season added successfully', season: newSeason });
    } catch (e) {
        return res.status(500).json({ message: 'Interval server error', error: e.message })
    }
}

const updateSeason = async (req, res) => {
    const title = safeTrim(req.body.title)
    const seasonId = req.params.id
    const userId = req.user.id
    try {
        if (!mongoose.Types.ObjectId.isValid(seasonId)) {
            return res.status(400).json({ message: "Season id is invalid" });
        }
        const season = await Season.findById(seasonId).populate('courseId', 'publisher')
        if (!season) {
            return res.status(404).json({ message: "Season not found " })
        }
        if (!season.courseId.publisher || userId !== season.courseId.publisher._id.toString()) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        if (!title) {
            return res.status(400).json({ message: "Nothing to update" });
        }
        season.title = title
        await season.save()
        res.json({ message: 'season updated!' })
    } catch (e) {
        return res.status(500).json({ message: 'Internal server error', error: e.message })
    }
}
const deleteSeason = async (req, res) => {
    const seasonId = req.params.id;
    const userId = req.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(seasonId)) {
            return res.status(400).json({ message: "Season id is invalid" });
        }

        const season = await Season.findById(seasonId)
            .populate('courseId', 'publisher');

        if (!season) {
            return res.status(404).json({ message: "Season not found" });
        }

        if (!season.courseId.publisher || userId !== season.courseId.publisher.toString()) {
            return res.status(403).json({ message: 'Forbidden: you must be owner of course' });
        }

        const videos = await Video.find({ seasonId: season._id });

        await Promise.all(videos.map(async (video) => {
            try {
                await deleteFile(video.url);
            } catch (err) {
                console.error(`Failed to delete file: ${video.url}`, err);
            }
            await Video.findByIdAndDelete(video._id);
        }));

        await Season.findByIdAndDelete(season._id);

        return res.json({ message: 'Season deleted!' });

    } catch (e) {
        return res.status(500).json({ message: 'Internal server error', error: e.message });
    }
};


module.exports = {
    addSeason,
    updateSeason,
    deleteSeason
}