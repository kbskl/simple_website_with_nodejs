const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name field is not empty"],
        trim: true,
        minlenght: 2,
        maxlenght: 30
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlenght: 2,
        maxlenght: 30
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    emailActive: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
}, { collection: 'user', timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User