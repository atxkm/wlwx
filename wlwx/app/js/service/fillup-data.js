define(['./service'], function(service) {
  'use strict';

  service.factory('fillupData', function() {

    /**
     * 填充日期段
     * 后台返回的数据中
     * 缺数据的日期未返回信息
     * 所以此操作补全缺失的数据为0
     * @param  {Array} timeArr 时间组
     * @param  {JSON}  data    数据JSON
     * @return {Array} dataArr 补全的数据组
     * 
     * @Author TaNg<tangxiaokui@126.com>
     * @Date   2016-04-06
     */
    return function(timeArr, data, key) {
      var dataArr = [];

      for (var i = 0, len = timeArr.length; i < len; i++) {
        var tempData = data[timeArr[i]];

        if (tempData) {

          if (key) {
            tempData = parseInt(tempData[key]);
          } else {
            tempData = parseInt(tempData);
          }
          dataArr.push(tempData);

        } else {
          dataArr.push(0);
        }
      }

      return dataArr;
    };
  });
});
