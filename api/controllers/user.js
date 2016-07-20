var User = require('../models/user.js');
var validator = require('./userValidator.js');

exports.getUsers = function (req, res) {
    User.find("", function (err, users) {
        if (err) console.log(err);
        res.send(users);
    });
};

exports.getUserById = function (req, res) {
    var id = req.params.id;
    User.findById(id, function (err, user) {
        if (err) console.log(err);
        res.send(user);
    });
};

exports.getUserByUserName = function (req, res) {
    var username = req.params.username;
    console.log(username);
    User.findOne({username: username}, function (err, user) {
        if (err) console.log(err);
        console.log(user);
        res.send(user);
    });
};

exports.createUser = function (req, res) {
    var user;
    var content = '';

    req.on('data', function (data) {
        // Append data.
        content += data;
    });

    req.on('end', function () {
        try {
            console.log("Content: " + content);
            // Assuming we are receiving JSON, parse the string into a JSON object
            var data = JSON.parse(content);

            if (!validator.validate(req, res, data))
                return;

            user = new User(data);
            user.salt = user.generateSalt();
            user.hash = user.hashPassword(user.hash, user.salt);
            user.token = user.generateToken();

            console.log(user);
            /*{
             username: data.username,
             hash: data.hash,
             salt: data.salt,
             token: generated
             });*/
            user.save(function (err, user) {
                if (!err) {
                    console.log("user created");
                    res.json({user_id: user._id, user: user});
                } else {
                    console.log(err);
                    res.send({"error": err.toString()});
                }
            });
        }
        catch (e) {
            // An error has occurred, log it
            console.log(e);
            res.send({"error": e.toString()});
        }
    });
};

exports.updateUser = function (req, res) {
    var id = req.params.id;
    var user = {};
    var content = '';

    req.on('data', function (data) {
        // Append data.
        content += data;
    });

    req.on('end', function () {
        // Assuming we are receiving JSON, parse the string into a JSON object
        try {
            var data = JSON.parse(content);

            if (!validator.validate(req, res, data))
                return;

            for (var key in data) {
                user[key] = data[key];
            }

            User.findByIdAndUpdate(id, user, function (err, user) {
                if (err) return console.log(err);
                res.send(user);
            });
        } catch (e) {
            console.log(e);
            res.send({"error": e.toString()});
        }
    });
};

exports.deleteUser = function (req, res) {
    var id = req.params.id;
    User.findById(id, function (err, user) {
        if (user != null) {
            user.remove(function (err) {
                if (!err) {
                    console.log("removed");
                    res.send('removed');
                } else {
                    console.log(err);
                    res.send({"error": e.toString()});
                }
            });
        } else {
            res.send(400, {"error": "Document not found"});
        }
    });
};