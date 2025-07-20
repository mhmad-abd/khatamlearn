const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
    content:{
        type: String,
        trim: true,
        required: true,
        minlength: 1
    },
    videoID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Video',
        required: true
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    parentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Comment',
        default: null
    }
})

module.exports = mongoose.model('Comment',commentSchema);