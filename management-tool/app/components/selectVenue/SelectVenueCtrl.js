AnalyticsManagementVisualizationApp.controller('SelectVenueCtrl', SelectVenueCtrl);

function SelectVenueCtrl($scope, $rootScope, venueService, $log, $window, $location, $uibModal) {


    function init() {
        $scope.showForm = true;
        $scope.venueCreated = false;

        $rootScope.isVenueSelected = false;
        delete $window.sessionStorage.currentVenueID;

        $scope.newVenue = {
            "name": "",
            "description": "",
            "address": {
                "street": "",
                "zip": "",
                "city": "",
                "country": ""
            },
            "location": {
                "latitude": "",
                "longitude": ""
            }
        }

        venueService.getVenues(function (data, status, header, config) {
            $scope.venues = data;
            $log.debug('Get All Venues: ');
            $log.debug(data);
        });
    };

    $scope.selectVenue = function (venueID) {
        $window.sessionStorage.currentVenueID = venueID;
        $rootScope.isVenueSelected = true;

        $location.path('/viewZones');
    };

    $scope.createVenue = function () {
        var onces = true;

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'components/selectVenue/selectVenueModal.html',
            scope: $scope,
            backdrop: 'static',
            keyboard: false
        });

        // saving modal changes - function after submit the form
        $scope.ok = function () {
            if (onces) {
                onces = false;

                venueService.createVenue(
                    $scope.newVenue
                , function (data) {
                    $log.debug(data);
                    $scope.showForm = false;
                    $scope.venueCreated = true;
                });
            }
        };

        $scope.applyModalChanges = function () {
            modalInstance.dismiss('cancel');
            init();
        };

        // dismiss modal changes
        $scope.cancel = function () {
            modalInstance.dismiss('cancel');
            init();
        };

    }

    init();
};