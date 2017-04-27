define(['./controller', 'echarts'], function(controller, echarts) {
  'use strict';

  controller.controller('PassengerTrend', [
    '$scope', '$http', 'fillupDate', 'fillupData', '$chartOption',
    function($scope, $http, fillupDate, fillupData, $chartOption) {
      $scope.title = '流量趋势';

      $scope.updateData = function(startDate, endDate) {
        var timeArr = fillupDate(startDate, endDate)

        $scope.loadPassData = true;
        $http({
          url: '/wlwx/outside/getFlowTrend',
          method: 'GET',
          params: {
            beginDateTime: startDate,
            endDateTime: endDate
          }
        }).
        success(function(response) {
          $scope.loadPassData = false;

          if (response !== '' && JSON.stringify(response) != '{}') {
            var dataArr = fillupData(timeArr, response);

            echarts.init(document.getElementById('passChart')).
            setOption(
              $chartOption.all(
                '店外客流趋势',
                timeArr,
                '人数',
                '{value}',
                dataArr,
                '{b}<br />店外客流：{c}人',
                '路过客流'
              )
            );

            $scope.hasPassData = true;

          } else {
            $scope.hasPassData = false;
          }
        });

        $scope.loadAllData = true;
        $http({
          url: '/wlwx/allFlowTrend',
          method: 'GET',
          params: {
            beginDateTime: startDate,
            endDateTime: endDate
          }
        }).
        success(function(response) {
          $scope.loadAllData = false;

          if (response !== '' && JSON.stringify(response) != '{}') {
            var dataArr = fillupData(timeArr, response);

            echarts.init(document.getElementById('allChart')).
            setOption(
              $chartOption.all(
                '客流总量趋势',
                timeArr,
                '人数',
                '{value}',
                dataArr,
                '{b}<br />总客流：{c}人',
                '客流总量'
              )
            );
            $scope.hasAllData = true;

          } else {
            $scope.hasAllData = false;
          }
        });
      }
    }
  ]);
});
