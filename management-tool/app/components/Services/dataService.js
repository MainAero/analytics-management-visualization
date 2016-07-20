angular.module('AnalyticsManagementVisualizationApp')

    .factory("dataService", function ($resource) {
        var HOST = window.location.origin;
        var ADDRESS = HOST + ':3000/api/v1/data';
        var authorization = 'Bearer ' +  window.sessionStorage.token;

        return $resource(ADDRESS,
            {
            },
            {
                /**
                * viewId (string),
                * start-date (ISODate),
                * end-date (ISODate),
                * dimensions (string): Implemented Dimensions: startingVisits, ongoingVisits, endingVisits, allVisitors, newVisitors, returningVisitors, passBy, longVisits, dateHour, dateDay, dateWeek, dateMonth, dateQuarter and dateYear. Not all dimensions combinations are allowed. Date dimensions (dateHour/dateDay...) can be combined with any non date dimension, or it can be omitted,
                * metrics (string): Implemented metrics: count, averageDwellTime and frequency. The averageDwellTime metric returns time in seconds
                **/
                'getData': {method: 'GET', isArray: false, headers: {'Authorization': authorization} }
            }
        );
    });