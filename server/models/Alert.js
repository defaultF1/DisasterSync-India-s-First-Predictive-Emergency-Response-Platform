const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['critical', 'high', 'moderate', 'low'],
        default: 'high'
    },
    channels: {
        type: [String],
        default: ['sms']
    },
    status: {
        type: String,
        default: 'Dispatched'
    },
    impact: {
        peopleAffected: Number,
        districts: Number
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Alert', AlertSchema);
