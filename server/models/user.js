const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 1,
        validate: {
            validator: isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.updateOne({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByEmailAndPassword = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        const hash = user.password;
        return bcrypt.compare(password, hash).then((success) => {
            if (success) {
                return user;
            } else {
                return Promise.reject();
            }
        });
    });
};

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    const {_id, email} = userObject;

    return {_id, email};
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(), access
    }, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
};

UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10).then((salt) => {
            bcrypt.hash(user.password, salt).then((hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const handleUplicateError = (err, res, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
        next(new Error('User already exists'));
    } else {
        next();
    }
}

UserSchema.post('save', handleUplicateError);

const User = mongoose.model('User', UserSchema);

module.exports = { User };