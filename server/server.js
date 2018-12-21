require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');

const { Recommendation } = require('./models/recommendation');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/recs', authenticate, (req, res) => {
    const { type, title, url, recommender } = req.body;

    const newRec = new Recommendation({
        type: type,
        title: title,
        url: url,
        recommender: recommender,
        _owner: req.user._id
    });

    newRec.save().then((rec) => {
        res.status(200).send(rec);
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/recs', authenticate, (req, res) => {
    Recommendation.find({_owner: req.user._id}).then((recs) => {
        res.status(200).send({recs: recs});
    }, (error) => {
        res.status(400).send(error);
    });
});

app.get('/recs/:id', authenticate,(req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid id');
    }
    Recommendation.findOne({_id: id, _owner: req.user._id}).then((rec) => {
        if (!rec) {
            return res.status(404).send();
        }
        res.status(200).send({rec: rec});
    }).catch((error) => {
        res.status(400).send(error)
    });
});

app.delete('/recs/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid id');
    }

    Recommendation.findOneAndDelete({_id: id, _owner: req.user._id}).then((rec) => {
        if (!rec) {
            return res.status(404).send();
        }
        res.status(200).send({rec: rec});
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.patch('/recs/:id', authenticate, (req, res) => {
    const id = req.params.id;
    var {title, recommender, url, consumed, type} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send();
    }

    consumed = typeof consumed === 'boolean' && consumed;

    Recommendation.findOneAndUpdate({_id: id, _owner: req.user._id}, {
        $set: {title, recommender, url, type, consumed}
    },{new: true, useFindAndModify: false}).then((rec) => {
        if (!rec) {
            return res.status(404).send();
        }
        res.status(200).send({rec});
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.post('/users/login', (req, res) => {
    const {email, password} = req.body;

    User.findByEmailAndPassword(email, password).then((user) => {
        // res.status(200).send(user);
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).status(200).send(user);
        });
    }).catch((err) => {
        res.status(401).send();
    });
});

app.post('/users', (req, res) => {
    const { email, password } = req.body;
    var user = new User({email, password});

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).status(200).send(user);
    }).catch((err)=> {
        res.status(400).send(err.message);
    });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

module.exports.app = app;