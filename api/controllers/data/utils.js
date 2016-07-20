/**
 * This functions takes a parameter of type date and returns a new date in UTC formant
 */
exports.date_to_UTC = function (date) {
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth();
    var day = date.getUTCDate();
    var hour = date.getUTCHours();
    return new Date(year, month, day, hour);
};

/**
 * The method creates and initialize an array with length of length and init-value of initVal
 * @param length - length of the needed array
 * @param initVal - the init value
 * @returns {Array} - initialized array by initVal with length of length
 */
exports.initArray = function (length, initVal) {
    var arr = [];
    for (var i = 0; i < length; i++) {
        arr[i] = initVal;
    }
    return arr;
};