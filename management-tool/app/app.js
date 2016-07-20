'use strict';

/**
 * @ngdoc overview
 * @name AnalyticsManagementVisualizationApp
 * @description
 * # AnalyticsManagementVisualizationApp
 *
 * Main module of the application.
 */

var AnalyticsManagementVisualizationApp = angular.module('AnalyticsManagementVisualizationApp', [
        'ngRoute',
        'ngAnimate',
        'ui.bootstrap',
        'angularCesium',
        'ngResource',
        'door3.css',
        'angularBootstrapNavTree',
        'd3',
        'rzModule'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/viewCreation', {
                templateUrl: 'components/viewCreation/viewCreation.html',
                controller: 'viewCreationCtrl'
            })
            .when('/login', {
                templateUrl: 'components/login/login.html',
                controller: 'LoginCtrl'
            })
            .when('/selectVenue', {
                templateUrl: 'components/selectVenue/selectVenue.html',
                controller: 'SelectVenueCtrl'
            })
            .when('/viewZones', {
                templateUrl: 'components/zoneList/zoneListView.html',
                controller: 'zoneListViewCtrl',
                css: 'components/zoneList/zoneListView.css'
            })
            .when('/viewViews', {
                templateUrl: 'components/viewList/viewListView.html',
                controller: 'viewListViewCtrl',
                css: 'components/viewList/viewListView.css'
            })
            .when('/createZone', {
                templateUrl: 'components/zoneCreation/zoneCreation.html',
                controller: 'zoneCreationCtrl'
            })
            .when('/svgImport', {
                templateUrl: 'components/svgImport/svgImport.html',
                controller: 'svgImportCtrl',
                css: 'components/svgImport/svgImport.css'
            })
            .when('/analytics/new', {
                templateUrl: 'components/analytics/analytics.html',
                controller: 'AnalyticsCtrl as vm',
                css: 'components/analytics/analytics.css'
            })
            .when('/analytics/list', {
                templateUrl: 'components/analytics/analyticsList.html',
                controller: 'AnalyticsListCtrl',
                css: 'components/analytics/analyticsList.css'
            })
            .otherwise({
                redirectTo: '/login'
            });
    });

// enables directive debugging to the console for testing purposes
AnalyticsManagementVisualizationApp.config(function ($logProvider) {
    $logProvider.debugEnabled(true);
});

AnalyticsManagementVisualizationApp.run(
    function ($rootScope, USER_ROLES, $log, $location, $window, AUTH_EVENTS) {

        // init value for resultCount
        $rootScope.resultCount = 50;

        // LOCATION CHANGE
        // ---------------
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            if ($location.path() !== '/login' && !$window.sessionStorage.token) {
                $log.info('app.js: wanted to go from ' + current + ' to ' + next);
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                $location.path('/login');
            }

            // debuggin
            // ------------------------------------------------
            //$log.debug('------');
            //$log.debug(typeof $window.sessionStorage.currentVenueID);
            //$log.debug($window.sessionStorage.currentVenueID);
            //$log.debug($rootScope.isVenueSelected);
            //$log.debug(!$rootScope.isVenueSelected);
            //$log.debug('------');


            // if someone will go to the desk system without an venueID
            // --------------------------------------------------------
            if ($rootScope.isVenueSelected === false && ( $location.path() !== '/login' || $location.path() !== '/selectVenue' )) {

                // if statement is true, although the path is /login...
                // ... so another if to check this case
                if ($location.path() === '/login') {
                    $location.path('/login');
                } else {
                    $location.path('/selectVenue');
                }
            }

            // reload page:
            // ------------
            if (next === current && $window.sessionStorage.token) {

                $log.warn($window.sessionStorage.currentVenueID);
                if ($window.sessionStorage.currentVenueID !== undefined) {
                    $log.warn('IS SET $window.sessionStorage.currentVenueID');
                    $rootScope.isVenueSelected = true;
                } else {
                    $log.warn('IS NOT SET $window.sessionStorage.currentVenueID');
                    $rootScope.isVenueSelected = false;
                    $location.path('/selectVenue');
                }

                $log.info('app.js: reaload page with athentification. Role type is: ' + $window.sessionStorage.userRole);
                $rootScope.isAuthenticated = true;

                switch ($window.sessionStorage.userRole) {
                    case USER_ROLES.admin:
                        $rootScope.isAdmin = true;
                        break;
                    case USER_ROLES.user:
                        $rootScope.isUser = true;
                        break;
                    default:
                        $log.error('$window.sessionStorage.userRole');
                        $log.error('Logged out and changed location to login');
                        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                }
            }

        });

        // LOGIN SUCCESS
        // -------------
        $rootScope.$on('auth-login-success', function (event, next, current) {
            $rootScope.isAuthenticated = true;
            angular.element('#page-wrapper').css('margin', '0 0 0 250px');

            switch ($window.sessionStorage.userRole) {
                case USER_ROLES.admin:
                    $rootScope.isAdmin = true;
                    $location.path('/admin');
                    break;
                case USER_ROLES.user:
                    $rootScope.isUser = true;
                    $location.path('/selectVenue');
                    break;
                default:
                    $log.error('undefined switch case for $window.sessionStorage.userRole');
                    $log.error('Logged out and changed location to login');
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            }

            $log.info('app.js: loginSuccess');
        });

        // LOGOUT SUCCESS
        // --------------
        $rootScope.$on('auth-logout-success', function (event, next, current) {
            $rootScope.isAuthenticated = false;
            $rootScope.isVenueSelected = false;

            delete $window.sessionStorage.token;
            delete $window.sessionStorage.userRole;
            delete $window.sessionStorage.currentVenueID;

            angular.element('#page-wrapper').css('margin', '0');
            $location.path('/login');
            $log.info('app.js: logoutSuccess');
        });

        // LOGIN FAILED
        // ------------
        $rootScope.$on('auth-login-failed', function (event, next, current) {
            angular.element('#page-wrapper').css('margin', '0');
            $rootScope.isAuthenticated = false;
            $rootScope.isVenueSelected = false;
            $location.path('/login');
            $log.info('app.js: loginFailed');
        });

        // NOT AUTHENTICATED
        // -----------------
        $rootScope.$on('auth-not-authenticated', function (event, next, current) {
            angular.element('#page-wrapper').css('margin', '0');
            $rootScope.isAuthenticated = false;
            $rootScope.isVenueSelected = false;
            $log.info('app.js: notAuthenticated');
        });

    });
