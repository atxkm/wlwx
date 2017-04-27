/**
 * 用户信息
 * @Author TaNg<tangxiaokui@126.com>
 * @Date   2016-01-08
 */
define(['./service'], function(service) {
  'use strict';

  service.factory('$session', [
    '$location',
    function($location) {
      var db = sessionStorage;

      return {
        setItem: function(key, value) {
          db.setItem(key, JSON.stringify(value));
        },
        getItem: function(key) {

          if (db.getItem(key)) {
            return JSON.parse(db.getItem(key));

          } else {
            return undefined;
          }
        },
        clear: function() {
          db.clear();
        }
      };
    }
  ]);
});
