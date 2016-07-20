var check = require('validator').check;
var _ = require('underscore');
// Simple user model validator
exports.validate = function (req, res, data) {

    if (_.isUndefined(data.username)) {
        res.send(400, {error: "Username required"});
        return false;
    }

    if (_.isUndefined(data.hash)) {
        res.send(400, {error: "Password required"});
        return false;
    }

    for (var key in data)
    {
        if (key == "username") {
            try {
                check(data.username, 'username NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }

        if (key == "hash") {
            try {
                check(data.hash, 'Password hash NULL').notNull();
            } catch (e) {
                res.send(400, {error: e.message});
                return false;
            }
        }
    }

    return true;
};
