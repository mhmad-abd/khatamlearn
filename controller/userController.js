const { default: mongoose } = require("mongoose")
const User = require("../models/User")
const { comparePass, hashingPass } = require("../utils/hash")
const tokenGenerator = require("../utils/tokenGenerator")
const { deleteFile } = require('../utils/s3')
const safeTrim = require('../utils/safeTrim')
const Request = require('../models/Request')
const Course = require('../models/Course')

const getUser = async (req, res) => {
    const userID = req.user.id
    try {
        const user = await User.findById(userID).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json(user)
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e.message })
    }
}

const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
    res.status(200).json({ message: 'Logout successful' })
}

const updateUser = async (req, res) => {
    const userID = req.user.id
    const { name, email, study, university, aboutMe, aboutTeacher } = req.body || {}
    let hasUpdated = false
    try {
        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (name) {
            user.name = name
            hasUpdated = true
        }
        if (study) {
            user.study = study
            hasUpdated = true
        }
        if (university) {
            user.university = university
            hasUpdated = true
        }
        if (aboutMe) {
            user.aboutMe = aboutMe
            hasUpdated = true
        }
        if (email) {
            user.email = email
            hasUpdated = true
        }
        if (user.role === 'Teacher') {
            user.aboutTeacher = aboutTeacher
            hasUpdated = true
        }
        if (req.file) {
            if (user.profilePic) {
                await deleteFile(user.profilePic)
            }
            user.profilePic = req.file.location
            hasUpdated = true
        }
        if (!hasUpdated) {
            return res.status(400).json({ message: "No fields to update" })
        }
        await user.save()
        res.json(user)
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e })
    }
}

const deleteUser = async (req, res) => {
    const userID = req.user.id

    try {
        const user = await User.findByIdAndDelete(userID)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        res.json({ message: "User deleted successfully" })
    } catch (e) {
        res.status(500).json({ message: 'Server error', error: e.message })
    }
}

const login = async (req, res) => {
    const { UserID, password } = req.body
    try {
        const user = await User.findOne({ UserID })
        if (!user) {
            return res.status(401).json({ message: 'The entered UserID is incorrect.' })
        }
        const compare = await comparePass(password, user.password)
        if (!compare) {
            return res.status(401).json({ message: 'The entered password is incorrect.' })
        }
        const { password: _, ...safeUser } = user.toObject()
        const token = tokenGenerator({ id: user._id, UserID: user.UserID, role: user.role })
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'none'
        })
        res.json({
            message: 'successful login',
            user: safeUser
        })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}

const register = async (req, res) => {
    try {
        const { name, UserID, password, email } = req.body
        if (!name || !UserID || !password || !email) {
            return res.status(400).json({ message: 'Fill all fields' })
        }

        const exiting = await User.findOne({ UserID })

        if (exiting) {
            return res.status(409).json({ message: 'There is a user with this UserID' });
        }


        const hashedPass = await hashingPass(password)
        const newUser = new User({ name, UserID, password: hashedPass, email })
        await newUser.save()
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

const savedCourse = async (req, res) => {
    const courseId = req.params.courseId
    const userId = req.user.id
    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Ivalid video ID' })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status().json({ message: 'User not found' })
        }
        const isSaved = user.CourseId.some(e => e.equals(courseId))
        if (isSaved) {
            user.CourseId = user.CourseId.filter(e => !e.equals(courseId))
        }
        else {
            user.CourseId.push(courseId)
        }
        await user.save()
        const saved = true
        res.status(200).json({ message: isSaved ? 'Course unsaved' : 'Course saved', saved })
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });

    }
}

const getSavedVideo = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await User.findById(userId).populate('CourseId')
        if (!user) {
            return res.status(400).json({ message: 'Invalid User' })
        }
        const courseId = user.CourseId
        res.status(200).json(courseId)
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

const setRequest = async (req, res) => {
    const userId = req.user.id
    const workExperience = safeTrim(req.body.workExperience)
    const additionalInfo = safeTrim(req.body.additionalInfo)
    const subject = safeTrim(req.body.subject)
    const reqType = safeTrim(req.body.reqType)
    try {
        if (!req.files || !req.files.profile || !req.files.resume) {
            if (req.files?.profile) await deleteFile(req.files.profile[0].location)
            if (req.files?.resume) await deleteFile(req.files.resume[0].location)
            return res.status(400).json({ message: 'Profile and resume files are required.' })
        }
        const user = await User.findById(userId)
        if (!user) {
            await deleteFile(req.files.profile[0].location)
            await deleteFile(req.files.resume[0].location)
            return res.status(404).json({ message: 'User not found' })
        }
        if (user.requestTeacher) {
            await deleteFile(req.files.profile[0].location)
            await deleteFile(req.files.resume[0].location)
            return res.status(400).json({ message: 'You have already sent a request to become a teacher.' })
        }
        if (!workExperience || !reqType || !subject) {
            await deleteFile(req.files.profile[0].location)
            await deleteFile(req.files.resume[0].location)
            return res.status(400).json({ message: 'Work experience, subject and request type are required' })
        }
        const newRequest = new Request({ user: user._id, workExperience, reqType, additionalInfo, resumeUrl: req.files.resume[0].location, subject })
        await newRequest.save()
        user.requestTeacher = true
        if (user.profilePic) {
            await deleteFile(user.profilePic)
        }
        user.profilePic = req.files.profile[0].location
        await user.save()

        res.status(201).json({ message: 'Request sent successfully' })
    } catch (e) {
        if (req.files?.profile) await deleteFile(req.files.profile[0].location)
        if (req.files?.resume) await deleteFile(req.files.resume[0].location)
        res.status(500).json({ message: 'Server Error', error: e.message })
    }
}

const changePass = async (req, res) => {
    const password = req.body.password?.trim()
    const newPassword = req.body.newPassword?.trim()
    const userId = req.user.id
    try {
        if (!password || !newPassword) {
            return res.status(400).json({ message: 'Both current and new password are required' })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }

        const compare = await comparePass(password, user.password)

        if (!compare) {
            return res.status(401).json({ message: 'invalid current password.' })
        }
        if (password === newPassword) {
            return res.status(400).json({ message: "New password must be different from the current password." })
        }

        const newHashedPassword = await hashingPass(newPassword)
        user.password = newHashedPassword
        await user.save()
        res.json({ message: 'Password has been changed' })
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message })

    }
}

const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.aggregate([
            { $match: { role: "Teacher" } },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "publisher",
                    as: "courses"
                }
            },
            {
                $addFields: {
                    coursesCount: { $size: "$courses" }
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    role: 1,
                    coursesCount: 1,
                    study: 1,
                    profilePic: 1
                }
            }
        ]);

        res.status(200).json({ teachers });
    } catch (e) {
        res.status(500).json({ message: "Server Error", error: e.message });
    }
};

const getOneTeacherCourses = async (req, res) => {
    const { id } = req.params
    try {
        const teacher = await User.findOne({ _id: id, role: "Teacher" }).select('-password');
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        const courses = await Course.find({ publisher: teacher._id }).sort({ createdAt: -1 })
        res.status(200).json({
            courses,
            teacher
        })
    } catch (e) {
        res.status(500).json({ message: "Server Error", error: e.message });
    }
}

const isSaved = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        const saved = user.CourseId.some(
            c => c.toString() === courseId
        );

        res.json({ saved }); // true یا false
    } catch (e) {
        return res.status(500).json({ message: 'server error', error: e.message });
    }
};

const myCoursesTeacher = async (req, res) => {
    const userId = req.user.id
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Ivalid video ID' })
        }
        const user = await User.findOne({ _id: userId, role: 'Teacher' })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const courses = await Course.find({ publisher: user._id })
        res.status(200).json(courses)

    } catch (e) {
        return res.status(500).json({ message: 'server error', error: e.message });
    }
}

module.exports = {
    getUser,
    logout,
    updateUser,
    deleteUser,
    login,
    register,
    savedCourse,
    getSavedVideo,
    setRequest,
    changePass,
    getAllTeachers,
    getOneTeacherCourses,
    isSaved,
    myCoursesTeacher
}