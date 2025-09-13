const mongoose = require('mongoose')

const majorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    // icon: {
    //     type: String,
    //     required: true,
    //     trim: true
    // }
})

module.exports = mongoose.model('Major', majorSchema)