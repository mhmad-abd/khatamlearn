const Course = require('../models/Course')
const mongoose = require('mongoose')
const Video = require('../models/Video')
const Season = require('../models/Season')
const { deleteFile } = require('../utils/s3')
const safeTrim = require('../utils/safeTrim')
const User = require('../models/User')

const addCourse = async (req, res) => {
    const title = safeTrim(req.body.title)
    const description = safeTrim(req.body.description)
    const userID = req.user.id
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'upload a thumbnail' })
        }
        if (!title || !description) {
            await deleteFile(req.file.location)
            return res.status(400).json({ message: 'Title or description can not be empty' })
        }
        const newCourse = new Course({ title, description, publisher: userID, thumbnailURL: req.file.location })
        await newCourse.save()
        res.json({ message: "Course created successfully" })
    } catch (e) {
        if (req.file) await deleteFile(req.file.location);
        return res.status(500).json({ message: 'Interval server error', error: e.message })
    }
}

const getCourse = async (req, res) => {
    const courseId = req.params.id
    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: 'Invalid course ID' });
        }
        const course = await Course.findById(courseId)
            .populate('publisher', 'name aboutTeacher')
            .populate({
                path: 'seasons',
                populate: { path: 'videos' } 
            });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' })
        }
        res.json(course)
    } catch (e) {
        return res.status(500).json({ message: 'Interval server error', error: e.message })
    }
}

const getAllCourses = async (req, res) => {
    const limit = 15
    const page = parseInt(req.query.page) || 1
    const skip = (page - 1) * limit
    try {
        const totalCourse = await Course.countDocuments()
        const courses = await Course.find()
            .populate('publisher', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        res.json({ courses, totalCourse, currentPage: page, totalPages: Math.ceil(totalCourse / limit) })
    } catch (e) {
        return res.status(500).json({ message: 'Interval server error', error: e.message })
    }
}

const deleteCourse = async (req, res) => {
    const courseId = req.params.id
    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course id' })
        }
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: 'Course not found' })
        }
        if (req.user.id !== course.publisher.toString()) {
            return res.status(403).json({ message: 'Forbidden: you must be owner of course ' })
        }
        const seasons = await Season.find({ courseId: course._id })
        if (seasons.length > 0) {
            for (const season of seasons) {
                const videos = await Video.find({ seasonId: season._id })
                await Promise.all(videos.map(async (video) => {
                    try {
                        await deleteFile(video.url);
                    } catch (err) {
                        console.error(`Failed to delete file: ${video.url}`, err);
                    }
                    await Video.findByIdAndDelete(video._id);
                }));
            }
            await Season.deleteMany({ courseId: course._id })
        }
        await Course.findByIdAndDelete(courseId)
        res.json({ message: 'Course deleted !' })
    } catch (e) {
        return res.status(500).json({ message: 'Interval server error', error: e.message })
    }
}

const updateCourse = async (req, res) => {
    const courseId = req.params.id
    const userId = req.user.id
    const title = safeTrim(req.body.title)
    const description = safeTrim(req.body.description)
    const aboutTeacher = safeTrim(req.body.aboutTeacher)
    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }
        const course = await Course.findById(courseId)
        const user = await User.findById(userId)
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (user._id.toString() !== course.publisher.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this course' });
        }
        if (!(title || description || aboutTeacher)) {
            return res.status(400).json({ message: 'At least one field is required to update' });
        }
        if (title) course.title = title
        if (description) course.description = description
        if (aboutTeacher) user.aboutTeacher = aboutTeacher
        course.save()
        user.save()
        res.status(200).json({ message: 'Course updated successfully' });

    } catch (e) {
        return res.status(500).json({ message: 'Interval server error', error: e.message })

    }
}

module.exports = {
    addCourse,
    getCourse,
    getAllCourses,
    deleteCourse,
    updateCourse
}