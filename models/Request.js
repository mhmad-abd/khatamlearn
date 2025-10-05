const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeUrl: {
        type: String,
        trim: true,
        required: true
    },
    workExperience: {
        type: String,
        trim: true,
        required: true
    },
    additionalInfo: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['UnderReview', 'Accepted', 'Rejected'],
        default: 'UnderReview'
    },
    reqType: {
        type: String
    },
    subject: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Request', requestSchema);