angular.module('AnalyticsManagementVisualizationApp')

.controller('requestDetailCtrl', function ($scope) {
	//console.log($scope.selected);
})

.directive('requestDetail', function () {
	return {
		restrict: 'AE',
		scope: {
			selected: "="
		}, // isolated scope, true for inherited parent scope
		controller: 'requestDetailCtrl',
		templateUrl: 'components/analytics/requestDetailDirective.html',
		link: function () {}
	};
});