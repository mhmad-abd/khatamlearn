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
    uploader:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    genre:{
        type: String,
        required: true,
        enum: ['ComputerEng','ElectricalEng','MechanicalEng','CivilEng','Mathematics and Statistics']
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    PDFUrl:{
        type : String,
        trim : true
    },
    thumbnailURL:{
        type: String,
        trim: true
    }
});


module.exports = mongoose.model('Video', videoSchema);