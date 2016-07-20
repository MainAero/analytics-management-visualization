var check = require('validator').check;
var _ = require('underscore');
exports.validate = function (req, res, data) {

    if (_.isUndefined(data.users)) {
        res.send(400, {error: 'No user/s provided.'});
        return false;
    }

    if (data.users.length < 1) {
        res.send(400, {error: 'No user/s provided.'});
        return false;
    }

    for (var key in data) {
        if (key == "name") {
            try {

                check(data.name, {notNull: 'Name NULL'}).notNull();

            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key == "description") {
            try {
                check(data.description, {notNull: 'Description NULL'}).notNull();

            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (data[key].hasOwnProperty("street")) {
            try {
                check(data.address.street, {notNull: 'Address street NULL'}).notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (data[key].hasOwnProperty("zip")) {
            try {
                check(data.address.zip, 'Address zip not a number').isNumeric();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (data[key].hasOwnProperty("city")) {
            try {
                check(data.address.city, {notNull: 'Address city NULL'}).notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (data[key].hasOwnProperty("country")) {
            try {
                check(data.address.country, {notNull: 'Address country NULL'}).notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (data[key].hasOwnProperty("latitude")) {
            try {
                check(data.location.latitude, 'Location latitude not a number').isNumeric();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (data[key].hasOwnProperty("longitude")) {
            try {
                check(data.location.longitude, 'Location longitude not a number').isNumeric();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key == "icon_URL") {
            try {
                check(data.icon_URL, {notNull: 'Icon url NULL'}).notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }
    }

    return true;
};
