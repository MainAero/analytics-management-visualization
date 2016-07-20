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

        if (key =="icon_URL") {
            try {
                check(data.icon_URL, 'Icon_URL NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key =="zone_arr") {
            try {
                check(data.zone_arr, 'Zone array NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key =="parents_arr") {
            try {
                check(data.parents_arr, 'Parents array NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key =="children_arr") {
            try {
                check(data.children_arr, 'Children array NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key =="attributes_arr") {
            try {
                check(data.attributes_arr, 'Attributes array NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key =="aggregate") {
            try {
                check(data.aggregate, 'Aggregate NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }
    }

    return true;
};
