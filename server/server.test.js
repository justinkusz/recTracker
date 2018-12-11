const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { Recommendation } = require('./models/recommendation');

const app = require('./server').app;

const recs = [
    {
        _id: new mongoose.Types.ObjectId().toHexString(),
        type: 'book',
        title: 'Lord of the Rings',
        url: 'https://www.tolkien.co.uk/',
        recommender: 'Sue Bob'
    },
    {
        _id: new mongoose.Types.ObjectId().toHexString(),
        type: 'movie',
        title: '2001: A Space Odyssey',
        url: 'https://www.imdb.com/title/tt0062622/',
        recommender: 'Joe Bob'
    }
];

beforeEach((done) => {
    Recommendation.deleteMany().then(() => {
        return Recommendation.insertMany(recs);
    }).then(() => done());
});

describe('Server', () => {
    describe('POST /recs', () => {
        it('should add and return a new recommendation', (done) => {
            const rec = {
                type: 'book',
                title: 'Rendezvous with Rama',
                url: 'https://www.amazon.com/Rendezvous-Rama-Arthur-C-Clarke/dp/0553287893',
                recommender: 'Sue Bob'
            };
            request(app).post('/recs')
                .send(rec)
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toMatchObject(rec);
                }).end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Recommendation.find({title: rec.title}).then((recs) => {
                        expect(recs.length).toBe(1);
                        expect(recs[0]).toMatchObject(rec);
                        done();
                    }).catch((err) => done(err));
                });
        });

        it('should not create a new rec with invalid data', (done) => {
            const rec = {};
            request(app).post('/recs')
                .send(rec)
                .set('Accept', 'application/json')
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Recommendation.find().then((recs) => {
                        expect(recs.length).toBe(2);
                        done();
                    }).catch((err) => done(err));
                });
        });
    });

    describe('GET /recs', () => {
        it('should return a list of all recommendations', (done) => {
            request(app).get('/recs')
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    expect(res.body.recs.length).toBe(2);
                    expect(res.body.recs).toMatchObject(recs);
                }).end(done);
        });
    });

    describe('GET /recs/:id', () => {
        it('should return a 400 when id is invalid', (done) => {
            request(app).get('/recs/someinvalidid')
                .set('Accept', 'application/json')
                .expect(400)
                .end(done);
        });

        it('should return 404 when id is not found', (done) => {
            const id = new mongoose.Types.ObjectId().toHexString();
            request(app).get(`/recs/${id}`)
                .set('Accept', 'application/json')
                .expect(404)
                .end(done);
        });

        it('should return a specific rec', (done) => {
            request(app).get(`/recs/${recs[0]._id}`)
                .set('Accept', 'application/json')
                .expect(200)
                .expect((res) => {
                    expect(res.body.rec).toMatchObject(recs[0]);
                }).end(done);
        });
    });

    describe('UPDATE /recs/:id', () => {
        it('should return a 400 if the id is invalid', (done) => {
            request(app).patch('/recs/someinvalidid')
                .expect(400)
                .end(done);
        });

        it('should return a 404 if the id is not found', (done) => {
            var rec = recs[0];
            rec._id = new mongoose.Types.ObjectId().toHexString();
            request(app).patch(`/recs/${rec._id}`)
                .send(rec)
                .expect(404)
                .end(done);
        });

        it('should update the rec', (done) => {
            var rec = recs[0];
            rec.consumed = true;
            request(app).patch(`/recs/${rec._id}`)
                .send(rec)
                .expect(200)
                .expect((res) => {
                    expect(res.body.rec.consumed).toBeTruthy();
                }).end(done);
        });
    });

    describe('DELETE /recs/:id', () => {
        it('should return a 400 if id is invald', (done) => {
            request(app).delete('/recs/someinvalidid')
                .expect(400)
                .end(done);
        });

        it('should return a 404 if id is not found', (done) => {
            const id = new mongoose.Types.ObjectId().toHexString();
            request(app).delete(`/recs/${id}`)
                .expect(404)
                .end(done);
        });

        it('should delete and return a specific rec', (done) => {
            const id = recs[0]._id;
            request(app).delete(`/recs/${id}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.rec).toMatchObject(recs[0]);
                }).end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Recommendation.findById(id).then((rec) => {
                        expect(rec).toBeFalsy();
                        done();
                    }).catch((err) => {
                        done(err);
                    });
                });
        });
    });
});