const expect = require('expect');
const request = require('supertest');
const mongoose = require('mongoose');
const { Recommendation } = require('../models/recommendation');
const { User } = require('../models/user');

const app = require('../server').app;
const { recs, users, populateRecs, populateUsers } = require('./seed/seed');

beforeEach((done) => {
    populateRecs(done);
});

beforeEach((done) => {
    populateUsers(done);
});

describe('Server', () => {
    describe('# Recommendations', () => {
        
        describe('POST /recs', () => {
            it('should add and return a new recommendation', (done) => {
                const rec = {
                    type: 'book',
                    title: 'Rendezvous with Rama',
                    url: 'https://www.amazon.com/Rendezvous-Rama-Arthur-C-Clarke/dp/0553287893',
                    recommender: 'Sue Bob',
                    _owner: users[0]._id
                };
                request(app).post('/recs')
                    .set('x-auth', users[0].tokens[0].token)
                    .send(rec)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.rec).toMatchObject(rec);
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        Recommendation.find({_owner: users[0]._id}).then((recs) => {
                            expect(recs.length).toBe(2);
                            done();
                        }).catch((err) => done(err));
                    });
            });

            it('should return a 401 if user is not authenticated', (done) => {
                const rec = {
                    type: 'book',
                    title: 'Rendezvous with Rama',
                    url: 'https://www.amazon.com/Rendezvous-Rama-Arthur-C-Clarke/dp/0553287893',
                    recommender: 'Sue Bob',
                    _owner: users[1]._id
                };
                request(app).post('/recs')
                    .send(rec)
                    .expect(401)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }
                        Recommendation.find({_owner: users[1]._id}).then((recs) => {
                            expect(recs.length).toBe(1);
                            done();
                        }).catch(err => done(err));
                    });
            });
    
            it('should not create a new rec with invalid data', (done) => {
                const rec = {};
                request(app).post('/recs')
                    .set('x-auth', users[0].tokens[0].token)
                    .send(rec)
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
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.recs.length).toBe(1);
                        expect(res.body.recs[0]).toMatchObject(recs[0]);
                    }).end(done);
            });

            it('should return a 401 if user is not authenticated', (done) => {
                request(app).get('/recs')
                    .expect(401)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end(done);
            });
        });

        describe('GET /recs/by/:recommender', () => {
            it('should return a 404 if recommender is not found', (done) => {
                request(app).get('/recs/by/somebogusrecommender')
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(404)
                    .end(done);
            });

            it('should return recs by recommender', (done) => {
                request(app).get(`/recs/by/${recs[0].recommender}`)
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.recs).toMatchObject([recs[0]]);
                    }).end(done);
            });

            it('should return a 401 if not authenticated', (done) => {
                request(app).get(`/recs/by/${recs[0].recommender}`)
                    .expect(401)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end(done);
            });
        });
    
        describe('GET /recs/:id', () => {
            it('should return a 400 when id is invalid', (done) => {
                request(app).get('/recs/someinvalidid')
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(400)
                    .end(done);
            });

            it('should return a 401 if not authenticated', (done) => {
                request(app).get(`/recs/${recs[0]._id}`)
                    .expect(401)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end(done);
            });

            it('should return a 404 if user is not owner', (done) => {
                request(app).get(`/recs/${recs[1]._id}`)
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(404)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end(done);
            });
    
            it('should return 404 when id is not found', (done) => {
                const id = new mongoose.Types.ObjectId().toHexString();
                request(app).get(`/recs/${id}`)
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(404)
                    .end(done);
            });
    
            it('should return a specific rec if user is owner', (done) => {
                request(app).get(`/recs/${recs[0]._id}`)
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.rec).toMatchObject(recs[0]);
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        Recommendation.findById(recs[0]._id).then((rec) => {
                            expect(rec._owner.toHexString()).toBe(users[0]._id);
                            done();
                        }).catch(err => done(err));
                    });
            });
        });
    
        describe('UPDATE /recs/:id', () => {
            it('should return a 400 if the id is invalid', (done) => {
                request(app).patch('/recs/someinvalidid')
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(400)
                    .end(done);
            });
    
            it('should return a 404 if the id is not found', (done) => {
                var rec = recs[0];
                rec._id = new mongoose.Types.ObjectId().toHexString();
                request(app).patch(`/recs/${rec._id}`)
                    .set('x-auth', users[0].tokens[0].token)
                    .send(rec)
                    .expect(404)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    })
                    .end(done);
            });

            it('should return a 401 if not authenticated', (done) => {
                var rec = recs[0];
                rec.consumed = true;
                request(app).patch(`/recs/${rec._id}`)
                    .send(rec)
                    .expect(401)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        Recommendation.findById(rec._id).then((rec) => {
                            expect(rec.consumed).toBeFalsy();
                            done();
                        }).catch(err => done(err));
                    });
            });

            it('should return a 404 if user is not owner', (done) => {
                var rec = recs[1];
                rec.consumed = true;
                request(app).patch(`/recs/${rec._id}`)
                    .set('x-auth', users[0].tokens[0].token)
                    .send(rec)
                    .expect(404)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        Recommendation.findById(rec._id).then((rec) => {
                            expect(rec.consumed).toBeFalsy();
                            done();
                        }).catch(err => done(err));
                    });
            });
    
            it('should update the rec if user is owner', (done) => {
                var rec = recs[0];
                rec.consumed = true;
                request(app).patch(`/recs/${rec._id}`)
                    .set('x-auth', users[0].tokens[0].token)
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
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(400)
                    .end(done);
            });
    
            it('should return a 404 if id is not found', (done) => {
                const id = new mongoose.Types.ObjectId().toHexString();
                request(app).delete(`/recs/${id}`)
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(404)
                    .end(done);
            });

            it('should return a 401 if not authenticated', (done) => {
                request(app).delete(`/recs/${recs[0]._id}`)
                    .expect(401)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        Recommendation.findById(recs[0]._id).then((rec) => {
                            expect(rec).toBeTruthy();
                            done();
                        }).catch(err => done(err));
                    });
            });

            it('should return a 404 if user is not owner', (done) => {
                request(app).delete(`/recs/${recs[1]._id}`)
                    .set('x-auth', users[0].tokens[0].token)
                    .expect(404)
                    .expect((res) => {
                        expect(res.body).toEqual({});
                    }).end((err, res) => {
                        if (err) {
                            return done(err);
                        }

                        Recommendation.findById(recs[1]._id).then((rec) => {
                            expect(rec).toBeTruthy();
                            done();
                        }).catch(err => done(err));
                    });
            });

            it('should delete and return a specific rec if user is owner', (done) => {
                const id = recs[0]._id;
                request(app).delete(`/recs/${id}`)
                    .set('x-auth', users[0].tokens[0].token)
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
                        expect(res.body).toEqual({});
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
                        expect(res.body).toEqual({});
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
                        expect(res.body).toEqual({});
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
                        expect(res.body).toEqual({});
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