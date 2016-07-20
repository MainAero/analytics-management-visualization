angular.module('AnalyticsManagementVisualizationApp')
    .directive('navbar', function () {
        return {
            restrict: 'E',
            controller: function ($scope, $rootScope, AUTH_EVENTS, $log, $window, $location) {

                $scope.username = $window.sessionStorage.username

                $scope.setVenue = function () {
                    $rootScope.isVenueSelected = false;
                    delete $window.sessionStorage.currentVenueID;
                    $location.path("/selectVenue");
                };

                $scope.logout = function () {

                    $log.warn('logout');
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                };

            },
            templateUrl: 'components/navbar/navbar.html'
        };
    });