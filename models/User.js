const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^(400|40[1-9]|4[1-9]\d|500)\d{6}(0[1-9]|[1-9][0-9])$/
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    // tokens: [{
    //     access: {
    //         type: String,
    //         required: true
    //     },
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }],
    role:{
        type: String,
        enum: ['admin','teacher','user'],
        default: 'user'
    }
});

module.exports = mongoose.model('User', userSchema);;