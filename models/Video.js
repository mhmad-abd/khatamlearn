const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
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
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:[]
    }],
    PDFUrl: {
        type: String,
        trim: true
    },
    view: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:[]
    }],
    seasonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Season',
        required: true
    }
});


module.exports = mongoose.model('Video', videoSchema);