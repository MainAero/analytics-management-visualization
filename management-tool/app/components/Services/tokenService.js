angular.module('AnalyticsManagementVisualizationApp')

    .factory("tokenService", function ($resource) {
        var HOST = window.location.origin;
        var ADDRESS = HOST + ':3000/api/v1/users/token/user';



        return $resource(ADDRESS,
            {
            },
            {
                'getToken': {params: {username: '', password: ''}, method: 'GET', isArray: false}
            }
        );
    });