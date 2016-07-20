AnalyticsManagementVisualizationApp.controller('AnalyticsCtrl', AnalyticsCtrl);

function AnalyticsCtrl($log, $rootScope, dataService, viewService, $scope, $location) {


	function initSidebar() {
		// sidebar code
		if ($rootScope.isSidebarSmall) {
			$log.debug('isSidebarSmall - true');
			angular.element("#page-wrapper").css('marginLeft', '40px');
		} else {
			$log.debug('isSidebarSmall - false');
			angular.element("#page-wrapper").css('marginLeft', '250px');
		}
	};

	initSidebar();

	// iniate list of vies for list element on the ui
	$scope.listOfViews = viewService.getViews();

	// represents the currently selected view of the list
	$scope.activeView = $scope.listOfViews[0];
	$scope.changeActiveView = function (activeView) {
		$scope.activeView = activeView;
	};

	$scope.runRequest = function () {

		// create and start new request
		var requestResult = dataService.getData({
			viewId: $scope.activeView._id,
			'start-date': $scope.request.startDate.toISOString(),
			'end-date': $scope.request.endDate.toISOString(),
			dimensions: $scope.request.dimensionTime + "," + $scope.request.dimensionVisitors,
			metrics: $scope.request.metric
		});

		var newRequest = {};
		newRequest.data = requestResult;
		newRequest.name = $scope.request.name;
		newRequest.viewID = $scope.activeView._id;
		newRequest.viewZones = $scope.activeView.zone_arr;
		newRequest.dimension = $scope.request.dimensionTime + "," + $scope.request.dimensionVisitors;
		newRequest.metrics = $scope.request.metric;
		console.log($scope.activeView);
		console.log(newRequest);

		// push the request to the global list
		if ($rootScope.analyticsRequests) {
			$rootScope.analyticsRequests.push(newRequest);
		} else {
			$rootScope.analyticsRequests = [newRequest];
		}

		// go back to the overview-page
		$location.path("/analytics/list");
	};

	$scope.cancel = function () {
		$location.path("/analytics/list");
	};
}