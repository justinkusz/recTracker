const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const Recommendation = mongoose.model('Recommendation', {
    type: {
        type: String,
        required: true,
        trim: true,
        enum: ['album', 'book', 'show', 'movie']
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        trim: true,
        validate: {
            validator: isUrl
        }
    },
    recommender: {
        type: String,
        trim: true,
        required: true
    },
    consumed: {
        type: Boolean,
        default: false
    }
});

module.exports = { Recommendation };