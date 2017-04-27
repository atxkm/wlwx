/**
 * 活跃度
 * @author TaNg
 * @date   2016-03-07T15:16:18+0800
 */
define(['./controller', 'echarts'], function(controller, echarts) {
  'use strict';

  controller.controller('LivenessCtrl', [
    '$scope', '$http', '$JSON', '$chartOption',
    function($scope, $http, $JSON, $chartOption) {
      $scope.title = '活跃度';

      $scope.updateData = function(params) {
        $scope.loadData = true;
        $http({
          url: '/wlwx/active',
          method: 'GET',
          params: params
        }).
        success(function(response) {
          $scope.loadData = false;

          if (response !== '' && JSON.stringify(response) != '{}') {
            var data = response,
              chartData = [];

            if (data.low > 0) {
              chartData.push({
                value: data.low,
                name: '低活跃度'
              });
            }

            if (data.middle > 0) {
              chartData.push({
                value: data.middle,
                name: '中活跃度'
              });
            }

            if (data.high > 0) {
              chartData.push({
                value: data.high,
                name: '高活跃度'
              });
            }

            if (data.sleep) {
              chartData.push({
                value: data.sleep,
                name: '沉睡顾客'
              });
            }

            echarts.init(document.getElementById('chart')).
            setOption({
              title: $chartOption.title('顾客活跃度信息'),
              legend: {
                x: 'right',
                data: ['低活跃度', '中活跃度', '高活跃度', '沉睡顾客'],
                selectedMode: false
              },
              color: $chartOption.color,
              tooltip: {
                trigger: 'item',
                showDelay: 0,
                borderRadius: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                axisPointer: {
                  type: 'line',
                  lineStyle: {
                    color: '#black',
                    width: 1,
                    type: 'solid'
                  },
                  shadowStyle: {
                    color: 'rgba(0, 0, 0, 0)',
                    width: 'auto',
                    type: 'default'
                  }
                },
                formatter: '{b}：{c}'
              },
              series: [{
                type: 'pie',
                radius: [0, '45%'],
                data: chartData,
                itemStyle: {
                  normal: {
                    label: {
                      show: true
                    },
                    labelLine: {
                      show: true
                    }
                  }
                }
              }],
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
