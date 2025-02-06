const mongoose = require('mongoose')

const privMSchema = new mongoose.Schema({
    _id: {
        type: String,
        ref: "User"
    },
    to_user: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    date_sent: {
        type: Date
    }
})

module.exports = mongoose.model('Private', privMSchema);
