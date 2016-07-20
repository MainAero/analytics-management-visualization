AnalyticsManagementVisualizationApp.controller('AnalyticsListCtrl', AnalyticsCtrl);

function AnalyticsCtrl($rootScope, dataService, viewService, $scope, $location, $filter, $log) {

	function initSidebar(){
		// sidebar code
		if($rootScope.isSidebarSmall) {
			angular.element("#page-wrapper").css('marginLeft', '40px');
		} else {
			angular.element("#page-wrapper").css('marginLeft', '250px');
		}
	};

	initSidebar();

	// go to another (sub)page
	$scope.goto = function (newPath) {
		$location.path(newPath);
	}

	// get initial requests
	if ($rootScope.analyticsRequests) {
		$scope.selectedRequest = $rootScope.analyticsRequests[0];
	} else {
		$scope.selectedRequest = null;
	}

	// change selected request
	$scope.setSelectedRequest = function (newRequest) {
		$scope.selectedRequest = newRequest;
	}

	// set / change the currently displayed kind of visualization
	$scope.display = "text";
	$scope.setDisplay = function (newDisplay) {
		$scope.display = newDisplay;
	}
}