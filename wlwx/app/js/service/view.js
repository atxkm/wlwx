/**
 * 将时间戳转换为年月日时分秒
 * @Author TaNg<tangxiaokui@126.com>
 * @Date   2016-01-08
 * @param {number}  timestamp 时间戳
 */
define(['./service'], function(service) {
  'use strict';

  service.factory('$view', function() {
  var reportKeywords = 'overview, realtime, enter-trend, passenger-trend, customer-type, dwelltime, visit-cycle, visit-times, liveness, phone-type,  heatmap',
    href = window.location.href,
    path = null;

  if (href.indexOf('#') != -1) {
    path = href.split('#')[1].substr(1);

  } else {
    path = window.location.pathname.substr(1);
  }

  if (new RegExp(path).test(reportKeywords)) {
    return 'report';

  } else {
    return 'manager';
  }
});
});
