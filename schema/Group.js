const mongoose = require('mongoose')

const groupMSchema = new mongoose.Schema({
    _id: {
        type: String,
        ref: "User"
    },
    room: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    date_sent: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Group', groupMSchema);
