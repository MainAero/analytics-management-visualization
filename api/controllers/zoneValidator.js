var check = require('validator').check;

exports.validate = function (req, res,data) {

    for (var key in data)
    {
        if (key =="name") {
            try {
                check(data.name, 'Name NULL').notNull();

            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key =="description") {
            try {
                check(data.description, 'Description NULL').notNull();

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

        if (data[key].hasOwnProperty("floorNumber")) {
            try {
                check(data.location.floorNumber, 'Floor number NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key =="location_description") {
            try {
                check(data.location_description, 'Location description NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key =="icon_URL") {
            try {
                check(data.icon_URL, 'Icon_URL NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key =="area") {
            try {
                check(data.area, 'Area not a number').isNumeric();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }
    }

    return true;
};
