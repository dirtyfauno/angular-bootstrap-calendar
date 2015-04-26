'use strict';

angular
  .module('mwl.calendar')
  .directive('mwlCalendarDay', function() {

    return {
      templateUrl: 'src/templates/calendarDayView.html',
      restrict: 'EA',
      require: '^mwlCalendar',
      scope: {
        events: '=',
        currentDay: '=',
        onEventClick: '=',
        dayViewStart: '@',
        dayViewEnd: '@',
        dayViewSplit: '@'
      },
      controller: function($filter, $log, $rootScope, $scope, $timeout, moment, calendarHelper, calendarConfig) {

        var vm = this;
        var dayViewStart, dayViewEnd;

        vm.calendarConfig = calendarConfig;

        vm.hourWasClicked = function (params) {
          $rootScope.$broadcast('hourWasClicked', params);
          $log.debug('hourWasClicked');
        };

        vm.eventClicked = function(params) {
          $rootScope.$broadcast('eventWasClicked', params);
          $log.debug('eventWasClicked');
        };

        function updateDays() {
          dayViewStart = moment($scope.dayViewStart || '00:00', 'HH:mm');
          dayViewEnd = moment($scope.dayViewEnd || '23:00', 'HH:mm');
          vm.dayViewSplit = parseInt($scope.dayViewSplit);
          vm.dayHeight = (60 / $scope.dayViewSplit) * 30;
          vm.days = [];
          var dayCounter = moment(dayViewStart);
          for (var i = 0; i <= dayViewEnd.diff(dayViewStart, 'hours'); i++) {
            vm.days.push({
              label: dayCounter.format(calendarConfig.dateFormats.hour)
            });
            dayCounter.add(1, 'hour');
          }
        }

        var originalLocale = moment.locale();

        $scope.$on('calendar.refreshView', function() {
          if (originalLocale !== moment.locale()) {
            originalLocale = moment.locale();
            updateDays();
          }

          vm.view = calendarHelper.getDayView($scope.events, $scope.currentDay, dayViewStart.hours(), dayViewEnd.hours(), vm.dayHeight);

        });

        updateDays();

      },
      controllerAs: 'vm'
    };

  });
