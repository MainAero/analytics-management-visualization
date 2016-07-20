var ObjectId = require('mongoose').Types.ObjectId;
var viewVisitsMerged = require('../../../models/viewvisitmerged.js');
var constants = require('./../constants.js');
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
    return constants.NUMBER;
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
 * 2. when there is noDate dimension.
 */
exports.getData = function (dateResolution, startD, endD, view_id, callback) {
    if (dateResolution == constants.NO_DATE)
        exports.getDataNoDate(dateResolution, startD, endD, view_id, callback);
    else
        dimUtils.getDataWithDateCallback(dateResolution, startD, endD, view_id, constants.STARTING_VISITS, constants.DWELL_TIME_MET, dimUtils.valueCountEvaluator, callback)
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
 * calculates the averageDwellTime for all the visits between startD and endD
 */
exports.getDataNoDate = function (dateResolution, startD, endD, view_id, callback) {
    // Group and sum documents by date
    var groupId = { $group: {
        _id: "$date",
        values: { $push: "$value" },
        metrics: { $push: "$metric" }
    }};

    // Filter between start and end date.
    var conditionsSet = { $match: {$and: [
        {"view_id": ObjectId(view_id)},
        {"dateDimension": constants.DATE_HOUR},
        {"dimension": constants.STARTING_VISITS},
        {$or: [
            {"metric": constants.DWELL_TIME_MET},
            {"metric": constants.COUNT_MET}
        ]},
        {"date": { $gte: startD, $lte: endD }}
    ]}};


    /**
     *  Getting the data according to the filter. This will return records that each one contains
     *  two Arrays (values, and metrics) with length of two for each one. The first array has the
     *  value (count of visits, and dwell time), and the second array has the metrics
     *  (to know the order of the values in the first array). From there we calculate the average.
     */
    viewVisitsMerged.aggregate(
        [
            conditionsSet,
            groupId
        ],
        {},
        function (err, records) {
            if (err) {
                callback({});
                console.log(err);
                return;
            }

            var totalVisitsCount = 0;
            var totalAvgDwellCount = 0;
            for (var i = 0; i < records.length; i++) {
                totalAvgDwellCount += records[i].values[0] * records[i].values[1];
                if (records[i].metrics[0] === constants.COUNT_MET)
                    totalVisitsCount += records[i].values[0];
                else
                    totalVisitsCount += records[i].values[1];
            }
            var newRecords = [
                {totalDwell: totalAvgDwellCount, totalVisits: totalVisitsCount}
            ];
            dimUtils.dwellGroupingWithoutDateCallback(err, newRecords, callback, dateResolution)
        });
};