define(['./directive'], function(directive) {
  'use strict';

  directive.directive('barManager', function() {
    return {
      restrict: 'E',
      templateUrl: 'html/template/bar-manager.html',
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
