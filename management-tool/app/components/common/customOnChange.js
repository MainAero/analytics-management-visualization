// this is an angular directive which can be used to call some angular function if a normal OnChange event fires.
// useful for tags which are not supported by standard angular directives, e.g. file inputs
// see http://stackoverflow.com/questions/17922557/angularjs-how-to-check-for-changes-in-file-input-fields

angular.module('AnalyticsManagementVisualizationApp')

.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});
