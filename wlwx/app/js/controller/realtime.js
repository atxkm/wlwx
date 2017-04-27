define(['./controller', 'echarts'], function(controller, echarts) {
  'use strict';

  controller.controller('RealtimeCtrl', [
    '$scope', '$http', '$JSON', '$chartOption', '$dateFormat',
    function($scope, $http, $JSON, $chartOption, $dateFormat) {
      $scope.title = '实时统计';

      var gotInNum = false,
        gotOutNum = false;

      //补齐数据时间
      var fixYaxis = function(json, type) {
        var min;
        for (var k in json) {
          min = k;
          break;
        }

        for (var i = 0; i < min; i++) {
          //type=2是店外的客流数据
          if (type == 2) {
            json[i] = 0;
          } else {
            json[i] = {
              news: 0,
              olds: 0
            };
          }
        }
        return json;
      };

      $scope.updateData = function(startDate, endDate) {

        //获取店内客流数据
        $scope.loadInData = true;
        $http({
          url: '/wlwx/realTime/in',
          method: 'GET'
        }).success(function(response) {
          $scope.loadInData = false;

          if (response != '' && JSON.stringify(response) != '{}') {
            var data = fixYaxis(response);
            echarts.init(document.getElementById('inRunChart')).
            setOption({
              legend: {
                top: '15',
                right: '30',
                data: ['新顾客', '老顾客', '顾客总量']
              },
              xAxis: {
                type: 'category',
                data: $JSON.getKey(data),
                axisTick: {
                  inside: true
                },
                axisLabel: {
                  formatter: function(value) {
                    return value + '点';
                  }
                }
              },
              yAxis: [{
                name: '人数(人)',
                type: 'value',
                splitLine: {
                  show: false
                },
                axisTick: {
                  inside: true
                },
                axisLabel: {
                  formatter: function(value) {
                    return parseInt(value);
                  }
                },
                axisLine: {
                  lineStyle: {
                    width: 2
                  }
                },
                splitArea: {
                  show: true,
                  areaStyle: {
                    color: ['#fcf0e9', '#ffffff', '#edf9fd', '#ffffff']
                  }
                }
              }],
              color: $chartOption.color,
              grid: {
                left: 30,
                right: 30
              },
              tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                  var fixUnde = function(v) {
                    return v || 0;
                  };
                  var newPe = params[0],
                    oldPe = params[1],
                    totalPe = params[2];
                  var newT = newPe.seriesName + ': ' + fixUnde(newPe.value) + '人',
                    oldT = oldPe.seriesName + ': ' + fixUnde(oldPe.value) + '人',
                    totalT = totalPe.seriesName + ': ' + fixUnde(totalPe.value) + '人';
                  return newT + '<br>' + oldT + '<br>' + totalT;
                }
              },
              series: [{
                name: '新顾客',
                type: 'bar',
                data: $JSON.getNewCustomer(data)
              }, {
                name: '老顾客',
                type: 'bar',
                data: $JSON.getOldCustomer(data)
              }, {
                name: '顾客总量',
                type: 'line',
                data: $JSON.getNewOldTotal(data)
              }]
            });
            $scope.hasInData = true;

          } else {
            $scope.hasInData = false;
          }
        });

        //获取店外客流数据
        $scope.loadOutData = true;
        $http({
          url: '/wlwx/realTime/out',
          method: 'GET'
        }).success(function(response) {
          $scope.loadOutData = false;

          if (response != '' && JSON.stringify(response) != '{}') {
            var data = fixYaxis(response, 2);

            echarts.init(document.getElementById('passRunChart')).setOption({
              xAxis: {
                type: 'category',
                data: $JSON.getKey(data),
                axisTick: {
                  inside: true
                },
                axisLabel: {
                  formatter: function(value) {
                    return value + '点';
                  }
                }
              },
              yAxis: [{
                name: '人数(人)',
                type: 'value',
                splitLine: {
                  show: false
                },
                axisTick: {
                  inside: true
                },
                axisLine: {
                  lineStyle: {
                    width: 2
                  }
                },
                splitArea: {
                  show: true,
                  areaStyle: {
                    color: ['#fcf0e9', '#ffffff', '#edf9fd', '#ffffff']
                  }
                }
              }],
              color: ['#f6a17a'],
              tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                  return params[0].seriesName + ': ' + params[0].value + '人';
                }
              },
              grid: {
                left: 30,
                right: 30
              },
              series: [{
                name: '路过客流',
                type: 'line',
                data: $JSON.getValue(data)
              }]
            });
            $scope.hasOutData = true;

          } else {
            $scope.hasOutData = false;
          }
        });

        //获取当前在店详情
        $http({
          url: '/wlwx/realTime/curPer',
          method: 'GET'
        }).success(function(response) {

          if (response !== '' && JSON.stringify(response) != '{}') {
            $scope.inNum = parseInt(response.news) + parseInt(response.olds);
            gotInNum = true;
            echarts.init(document.getElementById('inNumChart')).setOption({
              title: $chartOption.title('当前在店'),
              tooltip: {
                trigger: 'item',
                formatter: function(params) {
                  return params.name + ': ' + params.value + '人';
                }
              },
              legend: {
                x: 'center',
                y: 40,
                data: ['新顾客', '老顾客'],
                selectedMode: false
              },
              color: $chartOption.color,
              series: [{
                clockWise: false,
                type: 'pie',
                radius: ['50%', '80%'],
                center: ['50%', '60%'],
                data: [{
                  value: response.news,
                  name: '新顾客'
                }, {
                  value: response.olds,
                  name: '老顾客'
                }],
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
              }]
            });

            if (gotOutNum) {

              if ($scope.inNum + $scope.outNum == 0) {
                $scope.insideRate = 'Error';

              } else {
                $scope.insideRate = parseInt($scope.inNum * 10000 / ($scope.inNum + $scope.outNum)) / 100 + '%';
              }
            }
          }
        });

        //获取店外总量
        $http({
          url: '/wlwx/realTime/outs',
          method: 'GET'
        }).success(function(response) {

          if (response !== '' && JSON.stringify(response) != '{}') {
            $scope.outNum = parseInt(response);
            gotOutNum = true;

            if (gotInNum) {

              if ($scope.inNum + $scope.outNum == 0) {
                $scope.insideRate = '';

              } else {
                $scope.insideRate = parseInt($scope.inNum * 10000 / ($scope.inNum + $scope.outNum)) / 100 + '%';
              }
            }
          }
        });
      };

      $scope.updateData($dateFormat(new Date(), 'Y-M-D'), $dateFormat(new Date(), 'Y-M-D'));
    }
  ]);
});
