define(['./controller', 'echarts'], function(controller, echarts) {
  'use strict';

  controller.controller('VisitCycleCtrl', [
    '$scope', '$http', '$JSON', '$chartOption', 'fillupDate', 'fillupData',
    function($scope, $http, $JSON, $chartOption, fillupDate, fillupData) {
      $scope.title = '来访周期';

      $scope.updateData = function(startDate, endDate) {
        var timeArr = fillupDate(startDate, endDate);

        $scope.loadData = true;
        $http({
          url: '/wlwx/dwellTime/getVisitPeriodTrend',
          method: 'GET',
          params: {
            beginDateTime: startDate,
            endDateTime: endDate
          }
        }).
        success(function(response) {
          $scope.loadData = false;

          if (response.hasOwnProperty(0) && data[0] == 0) {
            $scope.hasData = false;

          } else if (response !== '' && JSON.stringify(response) != '{}') {
            var dataArr = fillupData(timeArr, response);

            for (var i = 0, len = timeArr.length; i < len; i++) {
              dataArr[i] = parseInt(parseFloat(dataArr[i]) / (3600 * 24) * 100) / 100;
            }

            echarts.init(document.getElementById('chart')).
            setOption(
              $chartOption.all(
                '平均来访周期趋势',
                timeArr,
                '天',
                '{value}',
                dataArr,
                '{b}<br />周期：{c}天',
                '来访周期'
              )
            );
            $scope.hasData = true;

          } else {
            $scope.hasData = false;
          }
        });
      };
    }
  ]);
});
