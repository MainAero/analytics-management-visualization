angular.module('AnalyticsManagementVisualizationApp')

.controller('zoneListViewCtrl', function ($scope, $location, zoneService, $rootScope, $log) {

	$log.debug($rootScope.isSidebarSmall);
	$rootScope.isSidebarSmall ? angular.element("#page-wrapper")[0].style.marginLeft = "40px" : angular.element("#page-wrapper")[0].style.marginLeft = "250px";

	$scope.listOfZones = zoneService.getZones();
	// TODO change to venueService.getAllZonesByVenue({id: someservice.getCurrentVenueID()}); 
	console.log($scope.listOfZones);
	$scope.activeZone = $scope.listOfZones[0];

	$scope.zoneChanging = function (newZone) {
		console.log("lsitview changing zone");
		$scope.activeZone = newZone;
	};

	$scope.createNewZone = function () {
		$location.path("/createZone");
	};

	$scope.importZones = function () {
		$location.path("/svgImport");
	};

	$scope.deleteZone = function () {

		if ($scope.activeZone) {

			console.log("deleting zone");

			// delete the one zone
			zoneService.deleteZone({
				id: $scope.activeZone._id
			}).$promise.then(function () {
				// and update them
				$scope.listOfZones = zoneService.getZones();
				$scope.activeZone = null;
			});

		}

	};
});