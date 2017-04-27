/**
 * 将时间戳转换为年月日
 * @Author TaNg<tangxiaokui@126.com>
 * @Date   2016-01-08
 * @param {number}  timestamp 时间戳
 */
define(['./service'], function(service) {
  'use strict';

  service.factory('$dateFormat', function() {

  return function(date, format) {
    var Y_M = /Y[\s\S]M/.test(format) ? format.match(/Y[\s\S]M/)[0].substr(1, 1) : '',
      M_D = /M[\s\S]D/.test(format) ? format.match(/M[\s\S]D/)[0].substr(1, 1) : '',
      D_h = /D[\s\S]*h/.test(format) ? format.match(/D[\s\S]*h/)[0].substr(1).replace('h', '') : '',
      h_m = /h[\s\S]m/.test(format) ? format.match(/h[\s\S]m/)[0].substr(1, 1) : '',
      m_s = /m[\s\S]s/.test(format) ? format.match(/m[\s\S]s/)[0].substr(1, 1) : '';

    var Y = /Y/.test(format) ? date.getFullYear() : '',
      M = /M/.test(format) ? date.getMonth() + 1 : '',
      D = /D/.test(format) ? date.getDate() : '',
      h = /h/.test(format) ? date.getHours() : '',
      m = /m/.test(format) ? date.getMinutes() : '',
      s = /s/.test(format) ? date.getSeconds() : '';

    if (D !== '' && format.split('D')[1] !== '') {
      D_h = format.split('D')[1];
    }

    return Y + Y_M + M + M_D + D + D_h + h + h_m + m + m_s + s;
  };
});
});
