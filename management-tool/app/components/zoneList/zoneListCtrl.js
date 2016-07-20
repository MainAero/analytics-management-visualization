angular.module('AnalyticsManagementVisualizationApp')

.controller("zoneListCtrl", function ($scope) {



})

.directive('zonelist', ["zoneService", function (zoneService) {
	return {
		restrict: 'AE',
		scope: {
			zones: "=",
			setzone: "="
		}, // isolated scope, true for inherited parent scope
		controller: 'zoneListCtrl',
		templateUrl: 'components/zoneList/zoneList.html',
		link: function ($scope, element, attrs) {

			$scope.selectedZoneID = null;
			$scope.editable = "editable" in attrs;

			$scope.remove = function (zone) {
				console.log("removing", zone);
				var index = $scope.zones.indexOf(zone);

				if (index > -1) {
					$scope.zones.splice(index, 1);
				}
			};

			$scope.updateSelectedZone = function (zone, index) {
				//console.log("updating selected zone to " + zone + " and zone index to " + index);
				$scope.setzone(zone);
				$scope.selectedZoneID = index;
			};

		},
		replace: true
	};
}]);