define(['./controller', 'echarts'], function(controller, echarts) {
  'use strict';

  controller.controller('DwelltimeCtrl', [
    '$scope', '$http', '$JSON', '$chartOption', 'fillupDate', 'fillupData',
    function($scope, $http, $JSON, $chartOption, fillupDate, fillupData) {
      $scope.title = '驻店时长';

      $scope.updateData = function(startDate, endDate) {
        var timeArr = fillupDate(startDate, endDate);

        $scope.loadData = true;
        $http({
          url: '/wlwx/getAvgStayTimeTrend',
          method: 'GET',
          params: {
            beginDateTime: startDate,
            endDateTime: endDate
          }
        }).
        success(function(response) {
          $scope.loadData = false;

          if (response !== '' && JSON.stringify(response) != '{}') {
            var dateArrNew = fillupData(timeArr, response, 'news'),
              dateArrOld = fillupData(timeArr, response, 'olds');

            for (var i = 0, len = timeArr.length; i < len; i++) {
              dateArrNew[i] = parseInt(dateArrNew[i] * 100 / 60) / 100;
              dateArrOld[i] = parseInt(dateArrOld[i] * 100 / 60) / 100;
            }

            echarts.init(document.getElementById('chart')).
            setOption({
              title: $chartOption.title("驻店时长趋势"),
              xAxis: $chartOption.xAxis(timeArr),
              yAxis: $chartOption.yAxis('分钟'),
              color: $chartOption.color,
              tooltip: $chartOption.tooltip('{b}<br />新顾客：{c0}分钟<br />老顾客：{c1}分钟'),
              legend: {
                x: 'right',
                data: [{
                  name: '新顾客'
                }, {
                  name: '老顾客'
                }]
              },
              series: [{
                name: '新顾客',
                type: 'line',
                data: dateArrNew
              }, {
                name: '老顾客',
                type: 'line',
                data: dateArrOld,
                itemStyle: {
                  normal: {
                    lineStyle: {
                      type: 'dotted'
                    }
                  }
                }
              }]
            });
            $scope.hasData = true;

          } else {
            $scope.hasData = false;
          }
        });
      };
    }
  ]);
});
