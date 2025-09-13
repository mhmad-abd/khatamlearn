const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    url: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    majorField: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Major',
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    PDFUrl: {
        type: String,
        trim: true
    },
    view: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    seasonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
        required: true
    }
});


module.exports = mongoose.model('Video', videoSchema);