angular.module('AnalyticsManagementVisualizationApp')
    .controller('SidebarCtrl', ['$scope', '$rootScope', '$log', function ($scope, $rootScope, $log) {

        $scope.isSidebarSmall = false;
        $rootScope.isSidebarSmall = $scope.isSidebarSmall;

        $scope.active = 'zones';

        $scope.setActive = function(value){
            $scope.active = value;
        }

        $scope.shrinkSidebar = function (isSmall) {
            $scope.isSidebarSmall = isSmall;
            $rootScope.isSidebarSmall = $scope.isSidebarSmall;
            $log.warn('shrinkFunction');
            if (isSmall) {
                angular.element("#page-wrapper").css('marginLeft', '40px');
            } else {
                angular.element("#page-wrapper").css('marginLeft', '250px');
            }
        };
    }])

    .directive('sidebar', function () {
        return {
            restrict: 'E',
            controller: 'SidebarCtrl',
            templateUrl: 'components/sidebar/sidebar.html'
        };
    });