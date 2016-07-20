var ObjectId = require('mongoose').Types.ObjectId;
var viewVisit = require('../../../models/viewvisit.js');
var constants = require('./../constants.js');
var moment = require('moment');
var dimUtils = require('./dimensionsUtils.js');

/**
 * This method returns the name of the dimension
 * @returns {string}
 */
exports.getName = function () {
    return constants.ONGOING_VISITS;
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
        dimUtils.getDataWithDateCallback(dateResolution, startD, endD, view_id, constants.ONGOING_VISITS, constants.COUNT_MET, dimUtils.valueCountEvaluator, callback);
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
        {"_id.view_id": ObjectId(view_id)},
        {$or: [
            {$and: [
                {"value.visitIntervals.date_entered": { $lte: startD}},
                {"value.visitIntervals.date_lastseen": { $gte: startD}}
            ]},
            {"value.visitIntervals.date_entered": {$gte: startD, $lte: endD}}
        ]}
    ]}};

    // Group and sum documents
    var groupId = { $group: {
        _id: constants.NO_DATE,
        total: { $sum: 1}
    }};

    viewVisit.aggregate(
        [
            // Create one document for each of the values in the array. Before we had each document with a target id and possibly many
            // pairs of date_entered & date_lastseen. After we will have one document for each of these pairs.
            { $unwind: "$value.visitIntervals" },
            // Filter between start and end date.
            conditionEntered,
            // Group documents by date (hour, date, and so on) and create a list of distinct targets for each group
            groupId

        ],
        {},
        function (err, records) {
            dimUtils.totalCountGroupingWithoutDateCallback(err, records, callback, dateResolution)
        });
};
