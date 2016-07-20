angular.module('AnalyticsManagementVisualizationApp')

.controller('viewAttributesCtrl', function ($scope, viewService) {

	$scope.updateView = function () {
		console.log("changing view");
		console.log($scope.view);

		viewService.updateView({
			id: $scope.view._id
		}, $scope.view);
	};
})

.directive('viewattributes', function () {
	return {
		restrict: 'AE',
		scope: {
			view: "="
		}, // isolated scope, true for inherited parent scope
		controller: 'viewAttributesCtrl',
		templateUrl: 'components/viewList/viewAttributes.html',
		link: function () {},
		replace: true,
	};
});