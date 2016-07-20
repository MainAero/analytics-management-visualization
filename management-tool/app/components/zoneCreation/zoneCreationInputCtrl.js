angular.module('AnalyticsManagementVisualizationApp')

.directive('zonecreationinput', function () {
	return {
		restrict: 'E',
		scope: {
			zone: "=",
		}, // isolated scope, true for inherited parent scope
		controller: 'zoneListCtrl',
		templateUrl: 'components/zoneCreation/zoneCreationInput.html',
		replace: true,
		link: function ($scope) {
			$scope.updateSelectedZones = function (z) {
				console.log("updating selected zone to " + z);
				$scope.setzone(z);
			};
		}
	};
})

.controller("zoneListCtrl", function () {});