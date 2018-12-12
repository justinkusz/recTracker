const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { Recommendation } = require('../models/recommendation');
const { User } = require('../models/user');

const app = require('../server').app;
const { recs, users, populateRecs, populateUsers } = require('./seed/seed');

describe('Server', () => {
    describe('# Recommendations', () => {
        
        beforeEach((done) => {
            populateRecs(done);
        });

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
                        }).catch((err) => done(err));
                    });
            });
        });
    });
    
    describe('# Users', () => {
        
        beforeEach((done) => {
            populateUsers(done);
        });

        describe('GET /users/me', () => {
            it('should return a user if authenticated', (done) => {
                request(app).get('/users/me')
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body._id).toBe(users[0]._id);
                        expect(res.body.email).toBe(users[0].email);
                    }).end(done);
            });

            it('should return a 401 if not authenticated', (done) => {
                request(app).get('/users/me')
                    .expect(401)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end(done);
            });
        });

        describe('DELETE /users/me/token', () => {
            it('should remove user auth token', (done) => {
                request(app).delete('/users/me/token')
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body).toMatchObject({});
                    })
                    .end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        User.findById(users[0]._id).then((user) => {
                            expect(user.tokens.length).toBe(0);
                            done();
                        }).catch(err => done(err));
                    });
            });

            it('should return a 401 if user is not authenticated', (done) => {
                request(app).delete('/users/me/token')
                    .expect(401)
                    .expect((res) => {
                        expect(res.body).toMatchObject({});
                    })
                    .end(done);
            });
        });

        describe('POST /users', () => {
            it('should create a user', (done) => {
                const email = 'testuser@email.com';
                const password = '123454321';

                request(app).post('/users')
                    .send({email, password})
                    .expect(200)
                    .expect((res) => {
                        expect(res.headers['x-auth']).toBeTruthy();
                        expect(res.body._id).toBeTruthy();
                        expect(res.body.email).toBeTruthy();
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        User.findOne({email}).then((user) => {
                            expect(user).toBeTruthy();
                            expect(user.password).not.toBe(password);
                            done();
                        }).catch((err) => done(err));
                    });
            });

            it('should return error if request invalid', (done) => {
                const email = 'notanemail.com';
                const password = 'totallyvalidpassword';

                request(app).post('/users')
                    .send({email, password})
                    .expect(400)
                    .end(done);
            });

            it('should not create user if email in use', (done) => {
                const email = users[0].email;
                const password = 'somecoolpassword';

                request(app).post('/users')
                    .send({email, password})
                    .expect(400)
                    .end(done);
            });
        });

        describe('POST /users/login', () => {
            it('should authenticate and return an existing user', (done) => {
                const {email,password} = users[1];
                request(app).post('/users/login')
                    .send({email, password})
                    .expect(200)
                    .expect((res) => {
                        expect(res.headers['x-auth']).toBeTruthy();
                        expect(res.body.email).toBe(email);
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        User.findById(users[1]._id).then((user) => {
                            expect(user).toBeTruthy();
                            expect(user.tokens[0]).toMatchObject({
                                access: 'auth',
                                token: res.headers['x-auth']
                            });
                            expect(user.password).not.toBe(password);
                            done();
                        }).catch((err) => done(err));
                    });
            });

            it('should return a 401 if user does not exist', (done) => {
                const email = 'notauser@email.com';
                const password = 'somepassword';

                request(app).post('/users/login')
                    .send({email, password})
                    .expect(401)
                    .expect((res) => {
                        expect(res.headers['x-auth']).not.toBeTruthy();
                        expect(res.body).toMatchObject({});
                    }).end(done);
            });

            it('should return a 401 if password is not correct', (done) => {
                const email = users[1].email;
                const password = users[1].password + '0';

                request(app).post('/users/login')
                    .send({email, password})
                    .expect(401)
                    .expect((res) => {
                        expect(res.headers['x-auth']).not.toBeTruthy();
                        expect(res.body).toMatchObject({});
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        User.findById(users[1]._id).then((user) => {
                            expect(user.tokens.length).toBe(0);
                            done();
                        }).catch((err) => done(err));
                    });
            });
        });
    });
});