var viewVisitsMerged = require('../../../models/viewvisitmerged.js');
var constants = require('./../constants.js');
var moment = require('moment');

exports.totalCountGroupingWithoutDateCallback = function (err, records, callback, dateResolution) {
    exports.returnResultByCallback(err, records, callback, dateResolution, exports.totalCountEvaluator)
};

exports.dwellGroupingWithoutDateCallback = function (err, records, callback, dateResolution) {
    exports.returnResultByCallback(err, records, callback, dateResolution, exports.dwellTimeEvaluator)
};

exports.frequencyGroupingWithoutDateCallback = function (err, records, callback, dateResolution) {
    exports.returnResultByCallback(err, records, callback, dateResolution, exports.frequencyEvaluator)
};

exports.getDataWithDateCallback = function (dateResolution, startD, endD, view_id, dimension, metric, valueEvaluator, callback) {
    var query = viewVisitsMerged.find({})
        .where('date').gte(startD)
        .where('date').lte(endD)
        .where('view_id', view_id)
        .where('dimension', dimension)
        .where('metric', metric)
        .where('dateDimension', dateResolution)
        .select("date")
        .select("value")
        .sort("date");

    query.exec(
        function (err, records) {
            exports.returnResultByCallback(err, records, callback, dateResolution, valueEvaluator);
        });
};

//The returnResultByCallback getting the query result as a list of records, and changes the format of the records
//based on the dimension (dateResolution) and the metric (valueEvaluator)
//The result is returned by the calling the callback method
exports.returnResultByCallback = function (err, records, callback, dateResolution, valueEvaluator) {
    //basic case: no results
    if (records == undefined) {
        console.log("records undefined");
        callback({});
        return;
    }

    var rows = [];
    var dateFormatter = exports.noHrDateFormatter;
    if (dateResolution == constants.NO_DATE)
        dateFormatter = exports.noDateFormatter;
    if (dateResolution == constants.DATE_HOUR)
        dateFormatter = exports.fullDateFormatter;

    for (var i = 0; i < records.length; i++) {
        rows.push(
            [dateFormatter(records[i]),
                valueEvaluator(records[i])]);
    }
    callback(rows);
};

exports.noDateFormatter = function (record) {
    return record._id;
};

exports.fullDateFormatter = function (record) {
    return moment(record.date).format("YYYY-MM-DDTHH:mmZ");
};

exports.noHrDateFormatter = function (record) {
    return moment(record.date).format("YYYY-MM-DDT00:00Z");
};

exports.totalCountEvaluator = function (record) {
    return record.total;
};

exports.valueCountEvaluator = function (record) {
    return record.value;
};

exports.dwellTimeEvaluator = function (record) {
    if (record.totalVisits == 0)
        return 0.0;

    return record.totalDwell / record.totalVisits;
};

exports.frequencyEvaluator = function (record) {
    return record.value;
};