angular.module('AnalyticsManagementVisualizationApp')

.directive('onhover', function () {
	return {
		restrict: 'A',
		scope: {
			hoverclass: "@"
		}, // isolated scope, true for inherited parent scope
		link: function (scope, element, attrs) {

			element.bind('mouseenter', function () {
				element.addClass(attrs.hoverclass);
			});

			element.bind('mouseleave', function () {
				element.removeClass(attrs.hoverclass);
			});

		}
	};
});