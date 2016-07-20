var check = require('validator').check;

exports.validate = function (req, res) {
    try {
        check(req.query.viewId, 'Id NULL').notNull();

    } catch (e) {
        var message = {error: e.message};
        res.send(400, message);
        return false;
    }
    try {
        check(req.param("start-date"), 'start date NULL').notNull();

    } catch (e) {
        var message = {error: e.message};
        res.send(400, message);
        return false;
    }
    try {
        check(req.param("end-date"), 'end date NULL').notNull();
    } catch (e) {
        var message = {error: e.message};
        res.send(400, message);
        return false;
    }
    try {
        check(req.query.dimensions, 'dimension NULL').notNull();
    } catch (e) {
        var message = {error: e.message};
        res.send(400, message);
        return false;
    }
    try {
        check(req.query.metrics, 'metric NULL').notNull();
    } catch (e) {
        var message = {error: e.message};
        res.send(400, message);
        return false;
    }

    return true;
};
