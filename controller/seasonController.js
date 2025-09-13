const Season = require('../models/Season')
const Course = require('../models/Course')
const { default: mongoose } = require('mongoose')


const addSeason = async (req, res) => {
    const title = req.body.title.trim()
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


module.exports = {
    addSeason
}