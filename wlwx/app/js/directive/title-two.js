define(['./directive'], function(directive) {
  'use strict';

  directive.directive('titleTwo', function() {
    return {
      restrict: 'E',
      templateUrl: 'html/template/title2.html',
      replace: true,
      controller: [
        '$scope',
        function($scope) {
          $scope.type = 'last30';

          $scope.getData = function() {
            var params = null;

            if ($scope.type == 'last30') {
              params = '';

            } else if ($scope.type == 'month') {
              params = {
                year: arguments[0],
                month: arguments[1]
              };

            } else {
              params = {
                year: arguments[0],
                quarter: arguments[1]
              };
            }

            $scope.updateData(params);
          };

          $scope.getData();
        }
      ]
    };
  });
});
