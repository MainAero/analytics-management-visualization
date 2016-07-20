angular.module('AnalyticsManagementVisualizationApp')

.directive('viewcreationinput', function () {
	return {
		restrict: 'E',
		scope: {
			view: "=",
		}, // isolated scope, true for inherited parent scope
		controller: 'viewListCtrl',
		templateUrl: 'components/viewCreation/viewCreationInput.html',
		replace: true,
		link: function () {

		}
	};
})

.controller("viewListCtrl", function () {});