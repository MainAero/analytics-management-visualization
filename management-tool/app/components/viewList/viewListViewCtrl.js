angular.module('AnalyticsManagementVisualizationApp')

.controller('viewListViewCtrl', function ($scope, $location, viewService, $rootScope, $window) {

	// sidebar code
	$rootScope.isSidebarSmall ? angular.element("#page-wrapper").css('marginLeft', '40px') : angular.element("#page-wrapper").css('marginLeft', '250px');


	$scope.listOfViews = viewService.getViews();
	$scope.activeview = $scope.listOfViews[0];

	$scope.changeActiveView = function (newview) {
		$scope.activeview = newview;
	};

	$scope.createNewView = function () {
		$location.path("/viewCreation");
	};

	$scope.deleteView = function () {

		if ($scope.activeview) {
			console.log("delete view");

			// delete one view
			viewService.deleteView({
				id: $scope.activeview._id
			}).$promise.then(function () {
				// and update them
				$scope.listOfViews = viewService.getViews();
				$scope.activeview = null;
			});
		}
	};
});