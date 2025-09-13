const mongoose = require('mongoose')


const seasonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }]
})

module.exports = mongoose.model('Season', seasonSchema);