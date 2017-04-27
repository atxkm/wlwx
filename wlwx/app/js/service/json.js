/**
 * 将时间戳转换为时分秒
 * @Author TaNg<tangxiaokui@126.com>
 * @Date   2016-01-07
 * @param {number}  timestamp 时间戳
 */
define(['./service'], function(service) {
  'use strict';

  service.factory('$JSON', function() {
  var getKey = function(json) {
    var keyArr = [];

    for (var key in json) {
      keyArr.push(key);
    }
    return keyArr;
  };

  var getValue = function(json) {
    var valueArr = [];

    for (var key in json) {
      valueArr.push(json[key]);
    }
    return valueArr;
  };

  var getNewCustomer = function(json) {
    var newArr = [];

    for (var key in json) {

      if (typeof json[key].news != 'undefined') {
        newArr.push(json[key].news);
      }
    }
    return newArr;
  };

  var getOldCustomer = function(json) {
    var oldArr = [];

    for (var key in json) {

      if (typeof json[key].olds != 'undefined') {
        oldArr.push(json[key].olds);
      }
    }
    return oldArr;
  };

  var getNewOldTotal = function(json) {
    var total = [];

    for (var key in json) {
      total.push(parseInt(json[key].olds) + parseInt(json[key].news));
    }
    return total;
  };

  return {
    getKey: getKey,
    getValue: getValue,
    getNewCustomer: getNewCustomer,
    getOldCustomer: getOldCustomer,
    getNewOldTotal: getNewOldTotal
  };
});
});
