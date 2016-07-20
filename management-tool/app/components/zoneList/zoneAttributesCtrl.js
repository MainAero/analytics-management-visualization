angular.module('AnalyticsManagementVisualizationApp')

.controller('zoneAttributesCtrl', function ($scope, zoneService, $log) {

	//$log.info($scope.$parent.$parent);
	$scope.importDone = $scope.$parent.$parent.importDone;


	$scope.updateZone = function () {
		console.log("changing zone", $scope.zone);

		zoneService.updateZone({
			id: $scope.zone._id
		}, $scope.zone);
	};

	$scope.onChangeHandler = function () {
		console.log("something changed");
	};

})

.directive('zoneattributes', function () {
	return {
		restrict: 'AE',
		scope: {
			zone: "="
		}, // isolated scope, true for inherited parent scope
		controller: 'zoneAttributesCtrl',
		templateUrl: 'components/zoneList/zoneAttributes.html',
		link: function () {},
		replace: true,
	};
});