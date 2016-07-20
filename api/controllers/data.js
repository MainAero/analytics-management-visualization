/*
 * GET wifirecord listing.
 */

var validator = require('./data/reqValidator.js');
var async = require('async');
var moment = require('moment');
var countStartingVisitsDim = require('./data/dimensions/countOfStartingVisitsDim.js');
var countOnGoingVisitsDim = require('./data/dimensions/countOfOnGoingVisitsDim.js');
var countEndingVisitsDim = require('./data/dimensions/countOfEndingVisitsDim.js');
var countPassByDim = require('./data/dimensions/countOfPassByDim.js');
var countLongVisitsDim = require('./data/dimensions/countOfLongVisitsDim.js');
var avgDwellOfVisitsDim = require('./data/dimensions/avgDwellOfAllVisitsDim.js');
var countAllVisitorsDim = require('./data/dimensions/countOfAllVisitorsDim.js');
var countNewVisitorsDim = require('./data/dimensions/countOfNewVisitorsDim.js');
var countReturningVisitorsDim = require('./data/dimensions/countOfReturningVisitorsDim.js')
var frequencyOfStartingVisitsDim = require('./data/dimensions/frequencyOfStartingVisitsDim.js');
var utils = require('./data/utils.js');
var constants = require('./data/constants.js');
var merger = require('./data/merger.js');

var dataResponse;


// Example for queries:
//http://localhost:3000/api/v1/data?viewId=52f8a739be04c4125d000006&start-date=2014-01-16T09:00&end-date=2014-01-20T19:00&dimensions=dateDay,startingVisits&metrics=count

exports.get_data = function (req, res) {
    if (!validator.validate(req, res))
        return;

    var view_id = req.query.viewId;
    var start_date = req.param("start-date");
    var end_date = req.param("end-date");
    var dimensions = req.query.dimensions;
    var metric = req.query.metrics;

    // Object to store information from several dimensions
    var results = {};

    // The result format according to api v1
    dataResponse = {
        start_date: start_date,  //this date is corrected later if there is a need
        end_date: end_date, //this date is corrected later if there is a need
        view_id: view_id,
        columnHeaders: [],
        rows: []
    };


    //////////////
    ////Metrics///
    //////////////
    //TODO we assume there is just one metric, to be changed when there are more than one metric
    dataResponse.columnHeaders.push(
        {
            name: metric,
            columnType: "METRIC"
        });

    //////////////
    //Dimensions//
    //////////////
    var dimArr = dimensions.split(",");
    var dimOrdArr = []; //The array is used to store the order of the requested dimensions
    var dateResolution = constants.NO_DATE;
    // Array used to store tasks/functions that will be executed by the async module
    var tasks = [];
    var inxOfDate = -1;
    for (var d = 0; d < dimArr.length; d++) {
        var dim = dimArr[d];
        //adding tasks to the tasks array, the function that will be executed by the async module

        var task = exports.getRelevantTask(dim, metric);
        var dataType = constants.STRING;
        if (task != -1) {
            addGetDataTask(task);
            dataType = task.getDataType();
        }

        //getting date dimension
        if (dim.indexOf("date") !== -1) {//contains
            dateResolution = dim;
            inxOfDate = d;
            dataType = constants.DATE;
        }

        //HEADER
        dataResponse.columnHeaders.push(
            {
                name: dim,
                columnType: "DIMENSION",
                dataType: dataType
            });
    }

    var startEndDate = {};
    startEndDate.start_date = dataResponse.start_date;
    startEndDate.end_date = dataResponse.end_date;
    correctDates(startEndDate, dateResolution);
    //In the database the date is in UTC and to be able to compare we need to transform the entered date in UTC
    //var startDUTC = utils.date_to_UTC(new Date(startEndDate.start_date));
    //var endDUTC = utils.date_to_UTC(new Date(startEndDate.end_date));
    var startDUTC = new Date(startEndDate.start_date);
    var endDUTC = new Date(startEndDate.end_date);

    //async.parallel is called and the tasks and run in parallel,
    //the optional callback will run after all tasks are completed
    async.parallel(tasks, function (err) {
        if (err) return next(err);
        var mergedResults = merger.merge(results, dimOrdArr);
        dataResponse.rows = merger.asRowsFormat(mergedResults, inxOfDate);
        res.send(dataResponse);
    });

    /**
     * @param task
     * Add task to the tasks array, which represents the queries (dims).
     * This task must have the structure described in "dimension/readMe"
     */
    function addGetDataTask(task) {
        if (task == -1)
            return;

        tasks.push(function (callback) {
            task.getData(dateResolution, startDUTC, endDUTC, view_id,
                function (result) {
                    results[task.getName] = result;//saves the rows returned from the function call in the results object
                    callback();//let async know the task is finished
                })
        });
        dimOrdArr.push(task.getName);
    }
};

//This method is responsible to return the relevant grouping task based on the dimension/metric
exports.getRelevantTask = function (dim, metric) {
    if (metric == constants.COUNT_MET) {
        if (dim == constants.ALL_VISITORS)
            return countAllVisitorsDim;

        if (dim == constants.NEW_VISITORS)
            return countNewVisitorsDim;

        if (dim == constants.RETURNING_VISITORS)
            return countReturningVisitorsDim;

        if (dim == constants.STARTING_VISITS)
            return countStartingVisitsDim;

        if (dim == constants.ONGOING_VISITS)
            return countOnGoingVisitsDim;

        if (dim == constants.ENDING_VISITS)
            return countEndingVisitsDim;

        if (dim == constants.PASS_BY)
            return countPassByDim;

        if (dim == constants.LONG_VISIT)
            return countLongVisitsDim;

    }

    else if (metric == constants.DWELL_TIME_MET) {

        if (dim == constants.STARTING_VISITS)
            return avgDwellOfVisitsDim;

    } else if (metric == constants.FREQUENCY) {

        if (dim == constants.STARTING_VISITS)
            return frequencyOfStartingVisitsDim;
    }
    return -1;
};


/**
 *
 * @param startEndDate the start/end date
 * @param dateResolution the date dimension
 * dataResponse json object with has start_date and end_date as fields
 *
 * This method corrects the dates by rounding it up/down depends on the dateResolution
 * This is needed when for example giving satrt date that starts at the middle of the year
 * and the dateResolution is year, so the satrt date must be rounded down to the beginning
 * of the year
 */
function correctDates(startEndDate, dateResolution) {

    /*if (dateResolution == constants.NO_DATE) //if no date dimension then no need to do any changes
        return;*/

    var m_start = moment(startEndDate.start_date);
    var m_end = moment(startEndDate.end_date);

    if (dateResolution == constants.DATE_YEAR) {
        m_start = m_start.startOf('year');
        m_end = m_end.endOf('year');
    } else if (dateResolution == constants.DATE_MONTH) {
        m_start = m_start.startOf('month');
        m_end = m_end.endOf('month');
    } else if (dateResolution == constants.DATE_WEEK) {
        m_start = m_start.startOf('isoWeek');
        m_end = m_end.endOf('isoWeek');
    } else if (dateResolution == constants.DATE_DAY) {
        m_start = m_start.startOf('day');
        m_end = m_end.endOf('day');
    } else if (dateResolution == constants.DATE_HOUR  || dateResolution == constants.NO_DATE) {
        m_start = m_start.startOf('hour');
        m_end = m_end.endOf('hour');
    } else if (dateResolution == constants.DATE_QUARTER) {
        var start_quarter = Math.floor((m_start.month() + 3) / 3); //take the start month of the start quarter
        var end_quarter = Math.floor((m_end.month() + 3) / 3); //take the start month of the end quarter
        m_start.month(3*(start_quarter-1));//take the start month of the start quarter
        m_end.month((3*(end_quarter-1))+2)//take the end month of the end quarter
        m_start = m_start.startOf('month');
        m_end = m_end.endOf('month');
    }

    startEndDate.start_date = m_start.format("YYYY-MM-DDTHH:mmZ");
    startEndDate.end_date = m_end.format("YYYY-MM-DDTHH:mmZ");
}