angular.module('AnalyticsManagementVisualizationApp')

.factory("viewService", function ($resource) {
	var HOST = window.location.origin;
	var ADDRESS = HOST + ':3000/api/v1/views';
	var authorization = 'Bearer ' +  window.sessionStorage.token;

	var views;


	function init() {
		views = [];
	};

	init();

	return $resource(ADDRESS + "/:id/:attributes/:attributesId/:children/:zones/:venueId/:venue", { id: "@_id" , attributesId: "@_attributesId", venueId: '@_venueId'},
			{
				// viewService.createView({venueId: 'venueId'}, viewObject);
				'createView':  {params: {venue: 'venue'},  method: 'POST', headers: {'Authorization': authorization} },

				// vieService.getViews();
				'getViews':   { method: 'GET', isArray: true, headers: {'Authorization': authorization} },

				// viewService.getView({id: 'ID'});
				'getView':    { method: 'GET', isArray: false, headers: {'Authorization': authorization} },

				// viewService.updateView({id: 'ID'}, viewObject);
				'updateView':  { method: 'POST', headers: {'Authorization': authorization} },

				// viewService.deleteView({id: 'ID'});
				'deleteView': { method: 'DELETE', isArray: false, headers: {'Authorization': authorization}},

				// viewService.getAllAttributes();
				'getAllAttributes': { params: {attributes: 'attributes'}, method: 'GET', isArray: false, headers: {'Authorization': authorization}},

				// viewService.getAttributes({id: 'viewID'});
				'getAttributes': { params: {attributes: 'attributes'}, method: 'GET', isArray: true, headers: {'Authorization': authorization}},

				// viewService.updateAttributes({id: 'viewID'}, attributesObject);
				'updateAttributes': {params: {attributes: 'attributes'}, method: 'POST', isArray: false, headers: {'Authorization': authorization}},

				// viewService.deleteAttribute({attributesId: 'attributesID'});
				'deleteAttribute': {params: {attributes: 'attributes'}, method: 'POST', isArray: false, headers: {'Authorization': authorization}},

				// viewService.getChildren({id: 'viewID'});
				'getChildren': {params: {children: 'children'}, method: 'GET', isArray: false, headers: {'Authorization': authorization}},

				// viewService.getZones({id: 'viewID'});
				'getZones': {params: {zones: 'zones'}, method: 'GET', isArray: true, headers: {'Authorization': authorization}}
			}
	);
});