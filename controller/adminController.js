const Major = require('../models/Major')
const User = require('../models/User')
const Request = require('../models/Request')

// start of Major section
const addMajor = async (req, res) => {
    const name = req.body.name.trim()
    try {
        if (!name) {
            return res.status(400).json({ message: 'enter valid name' })
        }
        const major = new Major({ name })
        await major.save()
        res.status(201).json({ message: 'Major created successfuly' })
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}
const getMajor = async (req, res) => {
    try {
        const majors = await Major.find()
        res.status(200).json({ majors })
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}
const updateMajor = async (req, res) => {
    const { id } = req.params;
    const name = req.body.name.trim();
    try {
        if (!name) {
            return res.status(400).json({ message: 'Enter valid name' });
        }
        const major = await Major.findByIdAndUpdate(id, { name }, { new: true });
        if (!major) {
            return res.status(404).json({ message: 'Major not found' });
        }
        res.status(200).json({ message: 'Major updated successfully', major });
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}
const deleteMajor = async (req, res) => {
    const { id } = req.params;
    try {
        const major = await Major.findByIdAndDelete(id);
        if (!major) {
            return res.status(404).json({ message: 'Major not found' });
        }
        res.status(200).json({ message: 'Major deleted successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}
//end Major section


// start of teacher section
const getRequest = async (req, res) => {
    try {
        const requests = await Request.find().populate('user', 'name email profilePic aboutMe UserID')
        res.status(200).json({ requests });
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

const approveRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const request = await Request.findByIdAndUpdate(id, { status: 'reviewed' }, { new: true });
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        const user = await User.findByIdAndUpdate(request.user, { role: "Teacher", requestTeacher: false }, { new: true })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Request approved', user });
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}

const declineRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const request = await Request.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        const user = await User.findByIdAndUpdate(request.user, { requestTeacher: false }, { new: true })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Request declined', user });
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}



const demoteTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, { role: 'user' }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Teacher demoted successfully', user });
    } catch (e) {
        res.status(500).json({ message: 'Server Error', error: e.message });
    }
}
//end of teacher section
module.exports = {
    addMajor,
    getMajor,
    updateMajor,
    deleteMajor,
    getRequest,
    approveRequest,
    declineRequest,
    demoteTeacher
}