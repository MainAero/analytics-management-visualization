var utils = require('./utils.js');

/**
 * The method take set of results of different dimensions and merge these results together by using the date as a key
 * to be able to merge related results. If date is not exist then the results will be merged in one entry
 * @param results - The queries (dimensions) results to be merged.
 * @param dimOrdArr - The order of hoe to merge result (which result appears first, which second, ...)
 * @returns {{}} - Set of merged results
 */
exports.merge = function (results, dimOrdArr) {
    var mergedResult = {};
    for (var dim = 0; dim < dimOrdArr.length; dim++) {
        var dimRows = results[dimOrdArr[dim]];

        for (var row = 0; row < dimRows.length; row++) { //each row is arr with length 2, <time(key), value>
            //todo check when length is 1
            var key = (dimRows[row])[0];
            var val = (dimRows[row])[1];
            if (!mergedResult.hasOwnProperty(key)) { //doesn't contain
                mergedResult[key] = utils.initArray(dimOrdArr.length, 0);
            }

            (mergedResult[key])[dim] = val;
        }
    }
    return mergedResult;
};

/**
 *
 * @param mergedResult - Set of merged results in the format returned by "merge"
 * @param dateInx - The index where date should appear in the results (-1 in case there is no date)
 * @returns {Array} - Merged result with the format described in the api v1.
 */
exports.asRowsFormat = function (mergedResult, dateInx) {
    var rowsResult = [];
    for (var key in mergedResult) {
        var dimResults = mergedResult[key];

        if (dateInx > -1){ //date is there
            dimResults.splice(dateInx, 0, key);
        }
        rowsResult.push(dimResults);
    }

    return rowsResult;
};