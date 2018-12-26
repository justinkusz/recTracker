const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const sanitizeUrl = require('@braintree/sanitize-url').sanitizeUrl;

const validateUrl = (url) => {
    return isUrl(url) && url === sanitizeUrl(url);
};

const RecommendationSchema = new mongoose.Schema({
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
            validator: validateUrl
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
    },
    _owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const handleError = (err, res, next) => {
    console.log(JSON.stringify(err.name, undefined, 2));
    if (err.name === 'ValidationError') {
        if (err.errors.url) {
            next(new Error('Invalid URL. Make sure to include the full URL e.g. "http://www.example.com"'));
        }
    }
    next(new Error(err.message));
}

RecommendationSchema.post('save', handleError);

const Recommendation = mongoose.model('Recommendation', RecommendationSchema);

module.exports = { Recommendation };