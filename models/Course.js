const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    seasons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
    }],
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    thumbnailURL: {
        type: String,
        trim: true,
        required: true
    }
})

module.exports = mongoose.model('Course', courseSchema)