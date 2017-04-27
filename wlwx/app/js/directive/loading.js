define(['./directive'], function(directive) {
  'use strict';

  directive.directive('loading', [
    '$interval',
    function($interval) {
      return {
        restrict: 'E',
        replace: true,
        template: '<div class="data-mark"><img src="img/load.png" class="loading"></div>',
        link: function(scope, element) {
          var timer = $interval(function() {
            var h = element[0].parentElement.clientHeight;

            if (h > 0) {
              $interval.cancel(timer);
              element.css('line-height', h + 'px');
            }
          }, 33);
        }
      };
    }
  ]);
});
