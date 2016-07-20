var Venue = require('../models/venue.js');
var validator = require('./venueValidator.js');

exports.getVenues = function(req, res){
    Venue.find({users: req.user}, function(err, venues){
        if (err) console.log(err);
        res.send(venues);
    });
};

exports.getVenueById = function(req, res){
    var id = req.params.id;
    Venue.find({_id: id, users: req.user}, function(err, venue){
        if (err) console.log(err);
        res.send(venue);
    });
};

exports.createVenue = function(req, res){
    var venue;
    console.log("POST: ");
    var content = '';
    var user = req.user;

    req.on('data', function (data) {
        // Append data.
        content += data;
    });

    req.on('end', function () {
        try {
            // Assuming we are receiving JSON, parse the string into a JSON object
            var data = JSON.parse(content);
            data.users = [user];
            if (!validator.validate(req, res, data))
                return;

            venue = new Venue(data);/*{
                name: data.name,
                description: data.description,
                address: {
                    street : data.address.street,
                    zip: data.address.zip,
                    city: data.address.city,
                    country: data.address.country
                },
                location: {
                    latitude: data.location.latitude,
                    longitude: data.location.longitude
                },
                icon_URL: data.icon_URL
            });*/
            venue.save(function (err, venue) {
                if (!err) {
                    console.log("created");
                    res.send({"venue id": venue._id});
                    //res.send(venue);
                } else {
                    console.log(err);
                    res.send({"error": err.toString()});
                }
            });
        } catch (e) {
            // An error has occurred, log it
            console.log(e);
            res.send({"error": e.toString()});
        }
    });
};

exports.updateVenue = function(req, res){
    var id = req.params.id;
    var venue = {};
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

            Venue.find({_id: id, users: req.user}, function(err, venue){
                if (err) return console.log(err);
                for(var key in data){
                    venue[key] = data[key];
                }
                venue.save();
                res.send(venue);
            });
        } catch (e) {
            console.log(e);
            res.send({"error":e.toString()});
        }
    });
};

exports.deleteVenue = function (req,res){
    var id = req.params.id;
    Venue.find({_id: id, users: req.user}).remove(function (err) {
        if (!err) {
            console.log("removed");
            res.send('removed');
        } else {
            console.log(err);
            res.send({"error":e.toString()});
        }

    });
};
