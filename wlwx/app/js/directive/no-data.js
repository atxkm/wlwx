define(['./directive'], function(directive) {
  'use strict';

  directive.directive('noData', [
    '$interval',
    function($interval) {
      return {
        restrict: 'E',
        replace: true,
        template: '<div class="data-mark"><img src="img/no-data.png"><span>No Data</span></div>',
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
