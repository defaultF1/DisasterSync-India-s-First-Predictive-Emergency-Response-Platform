const mongoose = require('mongoose');

// Define Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'commander', 'responder', 'public'],
        default: 'responder'
    },
    agency: {
        type: String,
        default: 'General'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

// Create Model
module.exports = mongoose.model('User', UserSchema);
