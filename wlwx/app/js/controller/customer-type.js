define(['./controller', 'echarts'], function(controller, echarts) {
  'use strict';

  controller.controller('CustomerTypeCtrl', [
    '$scope', '$http', '$chartOption', 'fillupDate', 'fillupData',
    function($scope, $http, $chartOption, fillupDate, fillupData) {
      $scope.title = '新老顾客';

      $scope.updateData = function(startDate, endDate) {
        var timeArr = fillupDate(startDate, endDate);

        $scope.loadData = true;
        $http({
          url: '/wlwx/getBuyerTrend',
          method: 'GET',
          params: {
            beginDateTime: startDate,
            endDateTime: endDate
          }
        }).
        success(function(response) {
          $scope.loadData = false;

          if (response !== '' && JSON.stringify(response) != '{}' && response.data && response.data != '') {
            var dataArrNew = fillupData(timeArr, response.data, 'news'),
              dataArrOld = fillupData(timeArr, response.data, 'olds');

            echarts.init(document.getElementById('chart')).
            setOption({
              title: $chartOption.title("新老顾客到店趋势"),
              xAxis: $chartOption.xAxis(timeArr),
              yAxis: $chartOption.yAxis('人数', '{value}'),
              color: $chartOption.color,
              tooltip: $chartOption.tooltip('{b}<br />新顾客：{c0}人<br />老顾客：{c1}人'),
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
                data: dataArrNew
              }, {
                name: '老顾客',
                type: 'line',
                data: dataArrOld,
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
      }
    }
  ]);
});
