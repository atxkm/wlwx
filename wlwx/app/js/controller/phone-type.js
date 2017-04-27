/**
 * 手机品牌
 */
define(['./controller', 'echarts'], function(controller, echarts) {
  'use strict';

  controller.controller('PhoneTypeCtrl', [
    '$scope', '$http', '$chartOption',
    function($scope, $http, $chartOption) {
      $scope.title = '厂商品牌';

      $scope.xArr = [];
      $scope.seriesArr = [];
      $scope.total = 0;

      var map = {
        Apple: '苹果',
        Huawei: '华为',
        Meizu: '魅族',
        Samsung: '三星',
        Xiaomi: '小米',
        ZTE: '中兴',
        qt: '其他',
        vivo: '步步高',
        Lenovo: '联想',
        Nokia: '诺基亚',
        HTC: 'HTC',
        OPPO: 'OPPO',
        Coolpad: '酷派'
      };

      $scope.updateData = function(startDate, endDate) {
        $scope.loadData = true;
        $http({
          url: '/wlwx/phone',
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
              xArr = [],
              seriesArr = [],
              total = 0,
              dom = '',
              qt = 0;

            for (var k in data) {

              if (data[k] == null) {
                data[k] = 0;
              }

              if (k == 'qt') {
                qt = data[k];
                continue;
              }

              xArr.push(map[k]);
              seriesArr.push(data[k]);
              total += parseInt(data[k]);
            }

            for (var i = 0, len = seriesArr.length; i < len; i++) {

              for (var j = 0; j < len - i - 1; j++) {

                if (seriesArr[j] < seriesArr[j + 1]) {
                  var tempS = seriesArr[j + 1];
                  seriesArr[j + 1] = seriesArr[j];
                  seriesArr[j] = tempS;

                  var tempX = xArr[j + 1];
                  xArr[j + 1] = xArr[j];
                  xArr[j] = tempX;
                }
              }
            }

            if (qt != 0) {
              xArr.push(map['qt']);
              seriesArr.push(qt);
              total += parseInt(qt);
            }

            dom = '<tr><th class="customer-detail-title"></th><th class="cd-num device-middle">品牌占比</th><th class="cd-rate">到访数量</th></tr>';

            for (var i = 0, len = xArr.length; i < len; i++) {
              dom +=
                '<tr class="cd-new">' +
                '<td class="cd-dot">' + xArr[i] + '</td>' +
                '<td class="device-middle">' + Math.round(seriesArr[i] * 10000 / total) / 100 + '%' + '</td>' +
                '<td>' + seriesArr[i] + '</td>' +
                '</tr>';
            }
            document.getElementById('table').innerHTML = dom;

            xArr.pop();
            seriesArr.pop();

            echarts.init(document.getElementById('chart')).
            setOption({
              title: $chartOption.title('厂商品牌'),
              tooltip: {
                trigger: 'item',
                showDelay: 0,
                borderRadius: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                axisPointer: {
                  type: 'line',
                  lineStyle: {
                    color: 'black',
                    width: 1,
                    type: 'solid'
                  },
                  shadowStyle: {
                    color: 'rgba(0, 0, 0, 0)',
                    width: 'auto',
                    type: 'default'
                  }
                },
                formatter: function(params) {
                  return params.name + '<br />' + '出现：' + params.value + '次<br />占比：' + Math.round(params.value * 100 / total) + '%';
                }
              },
              xAxis: {
                type: 'category',
                data: xArr,
                axisLine: {
                  lineStyle: {
                    width: 2,
                  }
                },
                axisTick: {
                  inside: true
                }
              },
              yAxis: $chartOption.yAxis('监测到的数量', ''),
              series: [{
                type: 'bar',
                data: seriesArr,
                itemStyle: {
                  normal: {
                    label: {
                      show: false
                    },
                    labelLine: {
                      show: false
                    }
                  }
                }
              }],
              grid: {
                left: 40,
                right: 10
              }
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
