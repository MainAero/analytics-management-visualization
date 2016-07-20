/**
 * @author MainAero
 */
var Venue = require('../../models/venue.js');
var exports = module.exports = {};
var _ = require('underscore');

exports.getIsValidVenueQuery = function (venueId, user) {
    return Venue.find({users: user, _id: venueId}, function (err, venue) {
        return !err && venue;
    }).exec();
};

exports.getIsValidVenueQuery = function (venueId, user) {
    return Venue.findOne({users: user, _id: venueId}, function (err, venue) {
        return !err && venue;
    }).exec();
};

exports.isUndefinedOrNull = function (value) {
    return (_.isUndefined(value) || _.isNull(value));
};

exports.isUserAllowed = function (model, user) {
    return (
    !exports.isUndefinedOrNull(model)
    && !exports.isUndefinedOrNull(user)
    && !exports.isUndefinedOrNull(model.venue)
    && !exports.isUndefinedOrNull(model.venue.users)
    && model.venue.users.indexOf(user._id) > -1
    )
    ;
};

exports.filterModelByUser = function (models, user) {
    return models.filter(function (zone) {
        return exports.isUserAllowed(zone, user);
    });
};

return exports;