define(['./service'], function(service) {
  'use strict';

  service.factory('fillupDate', function() {
    var fixDate = function(date) {
      if (date < 10) {
        date = '0' + date;
      }
      return date;
    };

    /**
     * 填充日期段
     * 后台返回的数据中
     * 缺数据的日期未返回信息
     * 所以此操作补全缺失的日期
     * @param  {String} startDate 键
     * @param  {String} endDate   值
     * @return {Array}  timeArr   补全的日期组
     * 
     * @Author TaNg<tangxiaokui@126.com>
     * @Date   2016-04-06
     */
    return function(startDate, endDate) {
      var s = new Date(startDate),
        e = new Date(endDate),
        timeArr = [];

      while (s <= e) {
        var dateStr = [s.getFullYear(), fixDate(s.getMonth() + 1), fixDate(s.getDate())].join('-');
        timeArr.push(dateStr);
        s.setDate(s.getDate() + 1);
      }

      return timeArr;
    };
  });
});
