define(['./directive'], function(directive) {

  directive.directive('titleHeatmap', [
    '$session', '$dateFormat',
    function($session, $dateFormat) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'html/template/title-heatmap.html',
        controller: [
          '$scope',
          function($scope) {
            $scope.checkType = 'multiple';
            $scope.singleDate = null;
            $scope.startDate = null;
            $scope.endDate = null;

            var replaceWords = function(str) {
              return str.replace(/年|月/g, '-').replace('日', '');
            };

            $scope.alert = function(arg) {
              alert(arg);
            };

            $scope.getData = function() {
              var startDate, endDate;

              if ($scope.checkType == 'single') {
                $session.setItem('singleDate', $scope.singleDate);

                var date = replaceWords($scope.singleDate);
                startDate = date;
                endDate = date;

              } else {

                if ($scope.canSearch) {
                  $session.setItem('startDate', $scope.startDate);
                  $session.setItem('endDate', $scope.endDate);

                } else {
                  $scope.startDate = $session.getItem('startDate');
                  $scope.endDate = $session.getItem('endDate');
                }

                startDate = replaceWords($scope.startDate);
                endDate = replaceWords($scope.endDate);
              }

              //updateData定义在HeatmapCtrl里
              $scope.updateData(startDate, endDate);
            };

            var juegeSearchCan = function() {
              var smallDate = new Date(replaceWords($scope.startDate));
              var bigDate = new Date(replaceWords($scope.endDate));

              if (smallDate.setDate(smallDate.getDate() + 1) > bigDate) {
                $scope.canSearch = false;

              } else {
                $scope.canSearch = true;
              }
            };

            $scope.$watch('startDate', juegeSearchCan);
            $scope.$watch('endDate', juegeSearchCan);

            //单日查询的日期初始化
            if (!!$session.getItem('singleDate')) {
              $scope.singleDate = $session.getItem('singleDate');

            } else {
              var date = new Date();
              date.setDate(date.getDate() - 1);
              $scope.singleDate = $dateFormat(date, 'Y年M月D日');
            }
            //多日查询的日期初始化
            if (!!$session.getItem('startDate')) {
              $scope.startDate = $session.getItem('startDate');
              $scope.endDate = $session.getItem('endDate');

            } else {
              var date = new Date();
              date.setDate(date.getDate() - 1);
              $scope.endDate = $dateFormat(date, 'Y年M月D日');
              date.setDate(date.getDate() - 1);
              $scope.startDate = $dateFormat(date, 'Y年M月D日');
            }

            var timer = setInterval(function() {

              if (document.getElementById('heatmapImg').clientHeight != 0) {
                $scope.getData();
                clearInterval(timer);
              }
            }, 33);
          }
        ]
      };
    }
  ]);
});
