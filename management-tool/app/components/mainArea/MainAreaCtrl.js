angular.module('AnalyticsManagementVisualizationApp')
	.controller('MainAreaCtrl', ['$window', 'Cesium', '$rootScope', '$scope',
        function ($window, Cesium, $rootScope, $scope) {
			$rootScope.isSidebarSmall ? angular.element("#page-wrapper")[0].style.marginLeft = "40px" : angular.element("#page-wrapper")[0].style.marginLeft = "250px";

			$scope.callback = function (polygon) {
				console.log("callback says hi", polygon);
			};
		}
    ]);