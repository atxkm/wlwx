define(['./controller', 'echarts'], function(controller, echarts) {
  'use strict';

  controller.controller('VisitTimesCtrl', [
    '$scope', '$http', '$chartOption',
    function($scope, $http, $chartOption) {
      $scope.title = '到访次数';

      $scope.updateData = function(startDate, endDate) {
        $scope.loadData = true;
        $http({
          url: '/wlwx/dwellTime/getCustomerByNum',
          method: 'GET',
          params: {
            beginDateTime: startDate,
            endDateTime: endDate
          }
        }).
        success(function(response) {
          $scope.loadData = false;

          if (response !== '' && JSON.stringify(response) != '{}') {
            var data = response,
              totalNum = 0;

            for (var i = 0, len = data.length; i < len; i++) {
              totalNum += parseInt(data[i]);
            }

            echarts.init(document.getElementById('chart')).
            setOption({
              tooltip: {
                trigger: 'item',
                formatter: function(params) {
                  return params.name + ': ' + params.value + '人(' + Math.round(params.value / totalNum * 10000) / 100 + '%' + ')';
                }
              },
              title: $chartOption.title('到访次数分布'),
              xAxis: [{
                name: '人数',
                type: 'value',
                splitLine: {
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    width: 2
                  }
                },
                axisTick: {
                  inside: true
                }
              }],
              yAxis: {
                name: '来访次数',
                type: 'category',
                data: ['1次', '2次', '3-5次', '5次以上'],
                axisLine: {
                  lineStyle: {
                    width: 2,
                    type: 'solid'
                  },
                },
                axisTick: {
                  inside: true
                }
              },
              series: [{
                type: 'bar',
                data: data,
                itemStyle: {
                  normal: {
                    color: '#16d1b9'
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
