const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
    content:{
        type: String,
        trim: true,
        required: true,
        minlength: 1
    },
    video:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Video',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Comment',commentSchema);