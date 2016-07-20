angular.module('AnalyticsManagementVisualizationApp')

    .controller('MapOptionCtrl', function ($scope, $filter, $log, viewService, zoneService, $rootScope) {

        $scope.request = $scope.selected.data;
        var startDate = $scope.selected.data.start_date;
        var endDate = $scope.selected.data.end_date;

        var zoneID = $scope.selected.viewZones[0];
        $log.debug(zoneID);

        $scope.display = $scope.$parent.$parent.display;
        $scope.results = $scope.selected.data.rows;


        viewService.getView({
            id: $scope.request.view_id
        }, function (data) {
            $log.warn('data after get view');
            $log.warn(data);
            $scope.viewName = data.name;
        });


        //zoneService.getZone({
        //    id: zoneID
        //}, function (data) {
        //    $log.warn(data.geometry);
        //});
        

        $scope.slider = {
            value: 17,
            options: {
                floor: 0,
                ceil: 23,
                onChange: function () {
                    $scope.getSelectedRequestValueForDate();
                }
            }
        };

        $scope.view = {
            id: $scope.selected.data.view_id,
            height: 0
        };

        // DAY
        $scope.formattedStartDateDay = $filter('date')(startDate, "dd");
        $scope.formattedEndDateDay = $filter('date')(endDate, "dd");
        $scope.optionRangeForDays = [];
        for (i = $scope.formattedStartDateDay; i <= $scope.formattedEndDateDay; i++) {
            var numberObject = {number: i};
            $scope.optionRangeForDays.push(numberObject);
        }

        // MONTH
        $scope.formattedStartDateMonth = $filter('date')(startDate, "MM");
        $scope.formattedEndDateMonth = $filter('date')(endDate, "MM");
        $scope.optionRangeForMonth = [];
        for (i = $scope.formattedStartDateMonth; i <= $scope.formattedEndDateMonth; i++) {
            var numberObject = {number: i};
            $scope.optionRangeForMonth.push(numberObject);
        }

        // YEAR
        $scope.formattedStartDateYear = $filter('date')(startDate, "yyyy");
        $scope.formattedEndDateYear = $filter('date')(endDate, "yyyy");
        $scope.optionRangeForYear = [];
        for (i = $scope.formattedStartDateYear; i <= $scope.formattedEndDateYear; i++) {
            var numberObject = {number: i};
            $scope.optionRangeForYear.push(numberObject);
        }

        $scope.selectedDate = {
            day: $scope.formattedStartDateDay,
            month: $scope.formattedStartDateMonth,
            year: $scope.formattedStartDateYear
        };


        $scope.getSelectedRequestValueForDate = function () {
            var curSelectedDate = $scope.selectedDate.year + '.' + $scope.selectedDate.month + '.' + $scope.selectedDate.day + ':' + $scope.slider.value;
            $scope.resultCount = 0;
            $log.debug('curSelectedDate: ' + curSelectedDate);

            angular.forEach($scope.results, function (result, index) {
                var curResultDate = $filter('date')(result[0], "yyyy.MM.dd:H");
                if (curResultDate === curSelectedDate) {
                    $log.debug('curResultDate: ' + curResultDate);
                    $scope.resultCount = result[1];
                }
            });
            $rootScope.resultCount = $scope.resultCount;
            $rootScope.$broadcast('scope.resultCount');
            $log.debug($scope.resultCount);
            $log.debug($rootScope.resultCount);

        }
    })

    .directive('mapOption', function () {
        return {
            restrict: 'AE',
            scope: {
                selected: "="
            }, // isolated scope, true for inherited parent scope
            controller: 'MapOptionCtrl',
            templateUrl: 'components/analytics/mapOptionDirective.html',
            link: function () {
            }
        };
    });