const { ObjectId } = require('mongoose').Types;
const { Recommendation } = require('../../models/recommendation');
const { User } = require('../../models/user');
const jwt = require('jsonwebtoken');

const objIds = [new ObjectId().toHexString(), new ObjectId().toHexString()];

const recs = [
    {
        _id: new ObjectId().toHexString(),
        type: 'book',
        title: 'Lord of the Rings',
        url: 'https://www.tolkien.co.uk/',
        recommender: 'Sue Bob'
    },
    {
        _id: new ObjectId().toHexString(),
        type: 'movie',
        title: '2001: A Space Odyssey',
        url: 'https://www.imdb.com/title/tt0062622/',
        recommender: 'Joe Bob'
    }
];

const users = [
    {
        _id: objIds[0],
        email: 'test@test.com',
        password: 'somepassword',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: objIds[0], access: 'auth'}, 'abc123').toString()
        }]
    },
    {
        _id: objIds[1],
        email: 'another@test.com',
        password: 'otherpassword'
    }
];

const populateRecs = (done) => {
    Recommendation.deleteMany({}).then(() => {
        return Recommendation.insertMany(recs);
    }).then(() => {
        done();
    });
};

const populateUsers = (done) => {
    return User.deleteMany({}).then(() => {
        var user = new User(users[0]).save();
        var user2 = new User(users[1]).save();

        return Promise.all([user, user2]);
    }).then(() => {
        done();
    });
}

module.exports = { recs, users, populateRecs, populateUsers };