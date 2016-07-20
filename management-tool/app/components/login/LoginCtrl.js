AnalyticsManagementVisualizationApp.controller('LoginCtrl', function ($log, $scope, tokenService, $window, $rootScope, $location, AUTH_EVENTS) {

    $rootScope.isAdmin = false;
    $rootScope.isUser = false;
    $scope.wrongCredentials = false;

    if (!$window.sessionStorage.token) {
        $log.info('Login broadcasted notAuthenticated!');
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
    } else {
        $log.info('Login broadcasted loginSuccess!');
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }


    $scope.credentials = {
        username: 'andyfeind',
        password: 'tuberlin'
    }

    $scope.login = function (credentials) {
        tokenService.getToken({
            username: credentials.username,
            password: credentials.password
        }, function (data, status, header, config) {
            $log.info('getToken response data: ')
            $log.info(data);

            if(data.status){
                $window.sessionStorage.token = data.token;
                $log.debug('SessionToken: ');
                $log.debug(data.token);
                $window.sessionStorage.userRole = 'user';
                $window.sessionStorage.username = data.username;
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            } else {
                $scope.wrongCredentials = true;
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            }
        })
    }
});