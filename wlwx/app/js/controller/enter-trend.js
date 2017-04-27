define(['./controller', 'echarts'], function(controller, echarts) {
  'use strict';

  controller.controller('EnterTrendCtrl', [
    '$scope', '$http', '$chartOption', 'fillupDate', 'fillupData',
    function($scope, $http, $chartOption, fillupDate, fillupData) {
      $scope.title = "入店趋势";
      $scope.currentDate = '';
      $scope.canSearch = true;

      $scope.updateData = function(startDate, endDate) {

        var timeArr = fillupDate(startDate, endDate);

        //入店量趋势获取
        $scope.loadNumData = true;
        $http({
          url: '/wlwx/dwellTime/getCustomerTrend',
          method: 'GET',
          params: {
            beginDateTime: startDate,
            endDateTime: endDate
          }
        }).
        success(function(response) {
          $scope.loadNumData = false;

          if (response !== '' && JSON.stringify(response) != '{}') {
            var dataArr = fillupData(timeArr, response);

            echarts.init(document.getElementById('inChart')).
            setOption(
              $chartOption.all(
                '入店量趋势',
                timeArr,
                '人次',
                '{value}',
                dataArr,
                '{b}<br />入店量：{c}次',
                '入店人次'
              )
            );
            $scope.hasNumData = true;

          } else {
            $scope.hasNumData = false;
          }
        });

        //入店率趋势获取
        $scope.loadRateData = true;
        $http({
          url: '/wlwx/dwellTime/getCustomerRateTrend',
          method: 'GET',
          params: {
            beginDateTime: startDate,
            endDateTime: endDate
          }
        }).
        success(function(response) {
          $scope.loadRateData = false;

          if (response !== '' && JSON.stringify(response) != '{}') {
            var dataArr = fillupData(timeArr, response);

            echarts.init(document.getElementById('inRateChart')).
            setOption($chartOption.all(
              '入店率趋势',
              timeArr,
              '百分比',
              '{value}%',
              dataArr,
              '{b}<br />入店率：{c}%',
              '入店率'
            ));

            $scope.hasRateData = true;

          } else {
            $scope.hasRateData = false;
          }
        });
      };
    }
  ]);
});
