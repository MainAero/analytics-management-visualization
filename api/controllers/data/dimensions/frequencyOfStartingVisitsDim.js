var ObjectId = require('mongoose').Types.ObjectId;
var viewVisits = require('../../../models/viewvisit.js');
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
 * @returns {Array}
 */
exports.getDataType = function () {
    return constants.ARRAY;
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
        dimUtils.getDataWithDateCallback(dateResolution, startD, endD, view_id, constants.STARTING_VISITS, constants.FREQUENCY, dimUtils.frequencyEvaluator, callback);
};

/**
 * @param dateResolution : date dimension - dateDay, dateMonth, noDate, ...
 * @param startD : first date to be included in the query
 * @param endD : last date to be included in the query
 * @param view_id : view to be considered in the query
 * @param callback : result of the query will be returned by this callback method
 *
 * The case when there is no date need to run the query manually using mongoose
 * functionality(aggregation, grouping, ..)
 */
exports.getDataNoDate = function (dateResolution, startD, endD, view_id, callback) {
    // Rename _id.target_id, value.date_entered and remove the _id as it is unnecessary
    var project = {
        $project: {
            target_id: "$_id.target_id",
            view_id: "$_id.view_id",
            date: "$value.date_entered",
            _id: 0
        }
    };

    // Group by target and count how many times this target entered (will give the frequency)
    var groupByTarget = {
        $group: {
            _id: "$target_id",
            frequency: {$sum: 1}
        }
    };

    // Group by frequency and count how many documents with this frequency
    var groupByFrequency = {
        $group: {
            _id: "$frequency",
            count: {$sum: 1}
        }
    };

    //Group documents by date and format the value parameter
    var groupByDate ={
        $group: {
            _id: constants.NO_DATE,
            value:{ $push:{
                frequency: "$_id",
                count: "$count"
                }
            }
        }
    };


    var conditionEntered = { $match: {$and: [
        {"_id.view_id": ObjectId(view_id)},
        {"value.visitIntervals.date_entered": { $gte: startD, $lte: endD }}
    ]}};

    viewVisits.aggregate(
        [
            // Create one document for each of the values in the array. Before we had each document with a target id and possibly many
            // pairs of date_entered & date_lastseen. After we will have one document for each of these pairs.
            { $unwind: "$value.visitIntervals" },
            // Filter between start and end date. For now, only considering data_entered.
            conditionEntered,
            // Keep only the needed fields (and rename for clarity)
            project,
            // Group documents by target a list of distinct targets for each group
            groupByTarget,
            // Group documents regarding the frequency
            groupByFrequency,
            // Group documents by date and format the document
            groupByDate
        ], {},
        function (err, records) {
            dimUtils.frequencyGroupingWithoutDateCallback(err, records, callback, dateResolution)
        });
};
