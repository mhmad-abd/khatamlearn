const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed'],
        default: 'pending'
    },
    type:{
        type:String,
        enum:['video','comment']
    }
})

reportSchema.pre('validate', function(next) {
    if (!this.video && !this.comment) {
        return next(new Error('report video or comment is required'));
    }
    else if(this.comment && this.video){
        return next(new Error('report can only be for video or comment'));
    }
    next();
});

const Report = mongoose.model('Report', reportSchema)

module.exports = Report