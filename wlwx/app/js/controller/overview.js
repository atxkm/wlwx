define(['./controller'], function(controller) {
  'use strict';

  controller.controller('OverviewCtrl', [
    '$scope', '$http', '$session',
    function($scope, $http, $session) {
      $scope.title = '店铺概览';
      $scope.currentDate = '';
      $scope.canSearch = true;

      $scope.updateData = function(startDate, endDate) {
        $scope.loadData = true;

        $http({
          url: '/wlwx/view',
          method: 'GET',
          params: {
            beginDateTime: startDate,
            endDateTime: endDate
          }
        }).success(function(response) {
          $scope.loadData = false;

          if (response.status && response.status == -1) {
            window.location.href = '/';

          } else if (response !== '' && JSON.stringify(response) != '{}') {
            $scope.passNum = response.allNum;
            $scope.getInNum = response.getinNum;
            $scope.getInTimes = response.getinTimes;

            $scope.getInRate = parseInt(parseFloat(response.getinNum) / parseFloat(response.allNum) * 10000) / 100;

            $scope.comeCycle = parseInt(parseFloat(response.clientCycle) / 864) / 1000;

            $scope.newClient = response.newClient;
            $scope.oldClient = response.oldClient;

            $scope.dwelltime = parseInt(parseFloat(response.dwellTime) / 60 * 100) / 100;

            $scope.deepTimes = response.deepTimes;
            $scope.deepNum = response.deepNum;
            $scope.deepRate = response.deepRate;
            $scope.jumpTimes = response.jumpTimes;
            $scope.jumpNum = response.jumpNum;
            $scope.jumpRate = response.jumpRate;

            $scope.hasData = true;

          } else {
            $scope.hasData = false;
          }
        });
      }
    }
  ]);
});
