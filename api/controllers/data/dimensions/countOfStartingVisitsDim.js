var ObjectId = require('mongoose').Types.ObjectId;
var viewVisitsMerged = require('../../../models/viewvisitmerged.js');
var constants = require('./../constants.js');
var moment = require('moment');
var dimUtils = require('./dimensionsUtils.js');

/**
 * This method returns the name of the dimension
 * @returns {string}
 */
exports.getName = function () {
    return constants.STARTING_VISITS;
};

/**
 * This method returns the data type of the dimension
 * @returns {string}
 */
exports.getDataType = function () {
    return constants.INTEGER;
};

/**
 * @param dateResolution : date dimension - dateDay, dateMonth, noDate, ...
 * @param startD : first date to be included in the query
 * @param endD : last date to be included in the query
 * @param view_id : view to be considered in the query
 * @param callback : result of the query will be returned by this callback method
 *
 * Returns the result according to the query parameters described above
 * there are two main cases:
 * 1. when there is a date dimension
 * 2. when there is noDate dimension
 */
exports.getData = function (dateResolution, startD, endD, view_id, callback) {
    if (dateResolution === constants.NO_DATE)
        exports.getDataNoDate(dateResolution, startD, endD, view_id, callback);
    else
        dimUtils.getDataWithDateCallback(dateResolution, startD, endD, view_id, constants.STARTING_VISITS, constants.COUNT_MET, dimUtils.valueCountEvaluator, callback);
};

/**
 * @param dateResolution : date dimension - dateDay, dateMonth, noDate, ...
 * @param startD : first date to be included in the query
 * @param endD : last date to be included in the query
 * @param view_id : view to be considered in the query
 * @param callback : result of the query will be returned by this callback method
 *
 * The case when there is no date need to run the query manually using mongoose
 * functionality(aggregation, grouping, ..) on the schema viewVisitsMerged
 * sums all the visits between startD and endD
 */
exports.getDataNoDate = function (dateResolution, startD, endD, view_id, callback) {

    // Filter between start and end date.
    var conditionEntered = { $match: {$and: [
        {"view_id": ObjectId(view_id)},
        {"dateDimension": constants.DATE_HOUR},
        {"dimension": constants.STARTING_VISITS},
        {"metric": constants.COUNT_MET},
        {"date": { $gte: startD, $lte: endD }}
    ]}};


    // Group and sum documents
    var groupId = { $group: {
        _id: constants.NO_DATE,
        total: { $sum: "$value" }
    }};

    viewVisitsMerged.aggregate(
        [
            conditionEntered,
            groupId
        ],
        {},
        function (err, records) {
            dimUtils.totalCountGroupingWithoutDateCallback(err, records, callback, dateResolution)
        });
};
