angular.module('AnalyticsManagementVisualizationApp')

.controller('viewCreationCtrl', ["$scope", "zoneService", "viewService", "$window", "$location", "$rootScope", function ($scope, zoneService, viewService, $window, $location, $rootScope) {

	// sidebar code
	$rootScope.isSidebarSmall ? angular.element("#page-wrapper").css('marginLeft', '40px') : angular.element("#page-wrapper").css('marginLeft', '250px');

	// init stuff
	$scope.views = viewService.getViews();
	$scope.zones = zoneService.getZones();
	$scope.newViewParts = [];
	$scope.showKind = "view";
	$scope.newView = {};

	$scope.createNewView = function () {

		console.log("creating view");

		var childzones = [],
			childviews = [];


		// get all children ids
		$scope.newViewParts.forEach(function (element) {
			if (element.geometry) {
				// zone
				childzones.push(element._id);
			} else if (element.zone_arr) {
				// view
				childviews.push(element._id);
			}
		});

		if (childzones.length > 0) {
			$scope.newView.zone_arr = childzones;
		}
		if (childviews.length > 0) {
			$scope.newView.children_arr = childviews;
		}

		console.log($scope.newView);
		console.log($window.sessionStorage.getItem("currentVenueID"));

		// and create the new view
		viewService.createView({
			venueId: $window.sessionStorage.getItem("currentVenueID")
		}, $scope.newView)

		$scope.clearNewView();

		$location.path("/viewViews");
	};

	$scope.clearNewView = function () {
		console.log("clearing view");
		$scope.newViewParts = [];
		$scope.newView = {};
	};

	$scope.addZone = function (newZone) {
		if ($scope.newViewParts.indexOf(newZone) < 0) {
			$scope.newViewParts.push(newZone);
		}
	};

	$scope.addView = function (newView) {
		if ($scope.newViewParts.indexOf(newView) < 0) {
			$scope.newViewParts.push(newView);
		}
	};

}]);