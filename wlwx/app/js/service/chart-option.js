define(['./service'], function(service) {
  'use strict';

  service.factory('$chartOption', function() {
    var axisLine = {
        lineStyle: {
          width: 2
        }
      },
      axisTick = {
        inside: true
      },
      color = ['#67fb41', '#66b4f4', '#e0791d'];

    var title = function(t) {
      return {
        text: t,
        textStyle: {
          fontSize: 18,
          fontFamily: '微软雅黑',
          color: '#e0791d'
        }
      };
    };

    var xAxis = function(data) {
      return [{
        type: 'category',
        data: data,
        axisTick: axisTick,
        axisLine: axisLine
      }];
    };

    var yAxis = function(name, formatter) {
      var yAxis = {
        name: name,
        type: 'value',
        splitLine: {
          show: false
        },
        axisLine: axisLine,
        axisTick: axisTick,
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#fcf0e9', '#ffffff', '#edf9fd', '#ffffff']
          }
        }
      };

      if (formatter) {
        yAxis.axisLabel = {
          formatter: formatter
        };
      }

      return [yAxis];
    };

    var series = function(data, tooltipName) {
      return [{
        type: 'line',
        data: data,
        name: tooltipName
      }];
    };

    var tooltip = function(formatter) {
      var tooltip = {
        trigger: 'axis',
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
        }
      };

      if (formatter) {
        tooltip.formatter = formatter;
      }

      return tooltip;
    };

    return {
      tooltip: tooltip,
      title: title,
      xAxis: xAxis,
      yAxis: yAxis,
      color: color,
      all: function(t, xData, yName, yLabelFmt, data, tooltipFmt, tooltipName) {
        return {
          title: title(t),
          xAxis: xAxis(xData),
          yAxis: yAxis(yName, yLabelFmt),
          series: series(data, tooltipName),
          tooltip: tooltip(tooltipFmt),
          // grid: {
          //   borderWidth: 'none'
          // },
          color: color
        };
      }
    };
  });
});
