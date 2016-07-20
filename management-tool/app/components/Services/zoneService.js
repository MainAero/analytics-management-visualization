angular.module('AnalyticsManagementVisualizationApp')

.factory("zoneService", function ($resource) {
	var HOST = window.location.origin;
	var ADDRESS = HOST + ':3000/api/v1/zones';
	var authorization = 'Bearer ' +  window.sessionStorage.token;

	var zones;

	function init() {
		zones = [];
	};

	init();

	return $resource(ADDRESS + "/:id/:venueId/:venue", { id: "@_id", venueId: '@_venueId'},
			{
				// zoneService.getZones();
				'getZones':   { method: 'GET', isArray: true, headers: {'Authorization': authorization} },

				// zoneService.getZonesByVenue({venueId: 'venueId'});
				'getZonesByVenue': {method: 'GET', isArray: true, headers: {'Authorization': authorization}},

				// zoneService.getZone({id: 'ID'});
				'getZone':    { method: 'GET', isArray: false, headers: {'Authorization': authorization} },

				// zoneService.updateZone({id: 'ID'}, zoneObject);
				'updateZone':  { method: 'POST', headers: {'Authorization': authorization} },

				// zoneService.deleteZone({id: 'ID'});
				'deleteZone': { method: 'DELETE', headers: {'Authorization': authorization} },

				// zoneService.createZoneInVenue({venueId: 'ID'}, zoneObject);
				'createZoneInVenue': {params: {venue: 'venue'}, method: 'POST', isArray: false, headers: {'Authorization': authorization}}
			}
	);
});