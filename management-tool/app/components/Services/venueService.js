angular.module('AnalyticsManagementVisualizationApp')

    .factory("venueService", function ($resource) {
        var HOST = window.location.origin;
        var ADDRESS = HOST + ':3000/api/v1/venues';
        var venues;
        var authorization = 'Bearer ' + window.sessionStorage.token;


        function init() {
            venues = [];
        };

        init();

        return $resource(ADDRESS + "/:id/:zones", {id: "@_id"},
            {
                // venueService.createVenue(venueObject);
                'createVenue': {param: { venueJSON: '' }, method: 'POST', headers: {'Authorization': authorization} },

                // venueService.getVenues();
                'getVenues': {method: 'GET', isArray: true, headers: {'Authorization': authorization} },

                // venueService.getVenue({id: 'ID'});
                'getVenue': {method: 'GET', isArray: false, headers: {'Authorization': authorization} },

                // venueService.updateVenue({id: 'ID'}, venueObject);
                'updateVenue': {method: 'POST', headers: {'Authorization': authorization} },

                // venueService.deleteVenue({id: 'ID'});
                'deleteVenue': {method: 'DELETE', headers: {'Authorization': authorization} },
            }
        );
    });