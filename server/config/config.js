var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 4000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/recTracker';
} else if (env === 'test') {
    process.env.PORT = 4000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/recTrackerTest';
} else if (env === 'production') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/recTracker';
}