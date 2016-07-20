angular.module('AnalyticsManagementVisualizationApp')

.controller('zoneCreationCtrl', function ($scope, Cesium, $location, zoneService, venueService, $rootScope) {

	// sidebar code
	$rootScope.isSidebarSmall ? angular.element("#page-wrapper").css('marginLeft', '40px') : angular.element("#page-wrapper").css('marginLeft', '250px');

	$scope.newZone = {
		name: "",
		description: "",
		location: {
			"floorNumber": 0
		},
		geometry: [],
		location_description: "",
		"venue": "Venue id"
	};

	$scope.callback = function (polygon) {
		polygon.positions.forEach(function (pos) {
			$scope.newZone.geometry.push([pos.x, pos.y]);
		});
		console.log($scope);
	};

	/**
	 * Create a new zone based on the provided values and the selected part of the map.
	 */
	$scope.createNewZone = function () {

		venueService.getVenues().$promise.then(function (data) {
			var venueID = data[0]._id;

			// set venue id
			$scope.newZone.venue = venueID;
			// TODO set area/location

			console.log($scope.newZone);
			// and create the zone
			zoneService.createZoneInVenue({
				venueId: venueID
			}, $scope.newZone);

			// and back to the overview
			$location.path("/viewZones");
		});

	};

	/**
	 * Go back to the list view of zones. Don't create a new zone
	 */
	$scope.abort = function () {
		console.log($scope.newZone);
		$location.path("/viewZones");
	};
});