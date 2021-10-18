const express = require('express');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const KEY = "m yincredibl y(!!1!11!)<'SECRET>)Key'!";


const app = express();
let userCredential = []

app.post('/signup', express.urlencoded(), function (req, res) {
    // in a production environment you would ideally add salt and store that in the database as well
    // or even use bcrypt instead of sha256. No need for external libs with sha256 though
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    let user = userCredential.find(value => value.username === req.body.username)
    if (user !== undefined) {
        console.error("can't create user " + req.body.username);
        res.status(409);
        res.send("An user with that username already exists");
    } else {
        console.log("Can create user " + req.body.username);
        userCredential.push({
            "username": req.body.username,
            "password": password
        })
        res.status(201);
        res.send("Success");
        console.log(userCredential)
    }
});

app.post('/login', express.urlencoded(), function (req, res) {
    console.log(req.body.username + " attempted login");
    var password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    let signedInUser = userCredential.find(value => value.username === req.body.username && value.password == password)
    if (signedInUser !== undefined) {
        var payload = {
            username: req.body.username,
        };

        var token = jwt.sign(payload, KEY, {algorithm: 'HS256', expiresIn: "15d"});
        console.log("Success");
        res.send(token);
    } else {
        console.error("Failure");
        res.status(401)
        res.send("There's no user matching that");
    }
});

app.get('/data', function (req, res) {
    var str = req.get('Authorization');
    try {
        jwt.verify(str, KEY, {algorithm: 'HS256'});
        res.send(str);
    } catch {
        res.status(401);
        res.send("Bad Token");
    }

});

let port = process.env.PORT || 3000;
app.listen(port, function () {
    return console.log("Started user authentication server listening on port " + port);
});
