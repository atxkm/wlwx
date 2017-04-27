/**
 * 在Session中缓存的输入信息
 * @param {string}  key 键
 * @param {string}  value 值
 * 
 * @Author TaNg<tangxiaokui@126.com>
 * @Date   2016-01-07
 * @Modify 2016-01-11
 */
define(['./service'], function(service) {
  'use strict';

  service.factory('$offset', function() {

  return function(element) {
    var offset = {
      top: element.offsetTop,
      left: element.offsetLeft
    };
    element = element.offsetParent;

    while (element !== null) {
      offset.top += element.offsetTop;
      offset.left += element.offsetLeft;
      element = element.offsetParent;
    }

    return offset;
  };
});
});
