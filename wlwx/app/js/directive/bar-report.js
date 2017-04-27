/**
 * 左侧单行蓝
 * @author TaNg
 * @date   2016-03-09T16:38:49+0800
 */
define(['./directive'], function(directive) {
  'use strict';

  directive.directive('barReport', function() {
    return {
      restrict: 'E',
      templateUrl: 'html/template/bar-report.html',
      replace: true,
      link: function($scope, $element, $attr) {
        var href = window.location.href,
          pathname = '';

        if (href.indexOf('#') != -1) {
          pathname = href.split('#')[1];

        } else {
          pathname = window.location.pathname;
        }
        $scope.item = pathname.substr(1);

        $scope.redirectToUrl = function(url) {
          $location.path('/' + url);
        };
      }
    };
  });
});
