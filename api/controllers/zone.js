var Zone = require('../models/zone.js');
var View = require('../models/view.js');
var validator = require('./zoneValidator.js');
var permissions = require('./helper/permissions.js');

exports.getZones = function (req, res) {
    Zone.find().populate('venue').exec(function (err, zones) {
        if (err) console.log(err);
        zones = permissions.filterModelByUser(zones, req.user);
        return res.send(zones);
    });
};

exports.getZoneById = function (req, res) {
    var id = req.params.id;
    Zone.findById(id).populate('venue').exec(function (err, zone) {
        if (err) console.log(err);
        console.log(zone);
        if (permissions.isUserAllowed(zone, req.user)) {
            return res.send(zone);
        }
        return res.json({error: "User not allowed."});
    });
};

exports.getZonesByVenue = function (req, res) {
    var venueId = req.params.venueId;
    console.log(venueId);
    Zone.find({"venue": venueId}).populate('venue').exec(function (err, zones) {
        zones = permissions.filterModelByUser(zones, req.user);
        if (err) console.log(err);
        return res.send(zones);
    });
};

//After creating zone, creating view for this zone by calling createViewByZone()
exports.createZone = function (req, res) {
    var zone;
    var venueId = req.params.venueId;

    if (typeof venueId == 'undefined') {
        res.send(400, {error: 'venueId null'});
        return;
    }

    console.log("POST: ");
    var content = '';

    req.on('data', function (data) {
        // Append data.
        content += data;
    });

    req.on('end', function () {

        var checkVenueQuery = permissions.getIsValidVenueQuery(venueId, req.user);

        checkVenueQuery.then(function (venue) {
            console.log("VENUE: ", venue);
            if (!venue) {
                res.send(400, {error: 'venueId not valid'});
                return;
            }

            try { // Assuming we are receiving JSON, parse the string into a JSON object
                var data = JSON.parse(content);
                data.venue = venue._id;
                if (!validator.validate(req, res, data))
                    return;
                zone = new Zone(data);
                /*{
                 name: data.name,
                 description: data.description,
                 location: {
                 latitude: data.location.latitude,
                 longitude: data.location.longitude,
                 floorNumber: data.location.floorNumber
                 },
                 location_description: data.location_description,
                 icon_URL: data.icon_URL,
                 area: data.area,
                 venue: id
                 });*/
                zone.save(function (err, zone) {
                    if (!err) {
                        console.log("zone created", zone);
                        exports.createViewByZone(zone._id, zone.name, res, req);
                    } else {
                        console.log(err);
                        return res.send({"error": err.toString()});
                    }
                });
            }
            catch (e) {
                // An error has occurred, log it
                console.log(e);
                return res.send({"error": e.toString()});
            }
        });
    });
};

//creating view for the created zone
exports.createViewByZone = function (zoneId, zoneName, res, req) {
    var zoneForView;
    Zone.findById(zoneId).populate('venue').exec(function (err, zone) {
        if (err) return false;
        if (permissions.isUserAllowed(zone, req.user)) {
            zoneForView = zone;
        }


        if (!zoneForView) {
            res.send(400, {"error": "ZoneId not valid"});
            return;
        }

        data = {
            name: "View of " + zoneName,
            description: "Automatically created view for zone: " + zoneName,
            zone_arr: [zoneId],
            aggregate: true
        };

        var view = new View(data);
        view.save(function (err, view) {
            if (!err) {
                console.log("view auto-created");
                return res.send({"zone id": zoneId});
            } else {
                console.log(err);
                return res.send({"error": err.toString()});
            }
        });
    });
};

exports.updateZone = function (req, res) {
    var id = req.params.id;
    var zone = {};
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

            Zone.findById(id).populate('venue').exec(function (err, zone) {
                if (err) return console.log(err);
                if (permissions.isUserAllowed(zone, req.user)) {
                    for (var key in data) {
                        zone[key] = data[key];
                    }
                    zone.save();
                }

                return res.send(zone);
            });
        } catch (e) {
            console.log(e);
            return res.send({"error": e.toString()});
        }
    });
};

exports.deleteZone = function (req, res) {
    var id = req.params.id;

    Zone.findById(id).populate('venue').exec(function (err, zone) {
        if (zone != null && permissions.isUserAllowed(zone, req.user)) {
            Zone.findById(id).remove(function (err) {
                if (!err) {
                    console.log("removed");
                    return res.send('removed');
                } else {
                    console.log(err);
                    return res.send({"error": e.toString()});
                }
            });
        } else {
            return res.send(400, {"error": "Document not found"});
        }
    });
};