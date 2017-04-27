/**
 * 管理-设备管理
 */
define(['./controller'], function(controller) {
  'use strict';

  controller.controller('DeviceCtrl', [
    '$scope', '$http',
    function($scope, $http) {
      $scope.title = '账户管理';
      $scope.curPage = 1;

      $scope.httpList = function(curPage) {
        $scope.curPage = curPage;

        $http({
          url: '/wlwx/device',
          method: 'GET',
          params: {
            'page.currentPage': curPage
          }
        }).
        success(function(response) {
          var status = response.msg,
            data = response.data;

          if (status == 'success') {
            $scope.deviceList = data;
            $scope.pageTotal = parseInt((response.count - 1) / 10) + 1;
            $scope.pageList = [];

            var curPage = $scope.curPage,
              pageTotal = $scope.pageTotal,
              pageStart = curPage > 5 ? (curPage + 4 > pageTotal && pageTotal > 10 ? pageTotal - 9 : curPage - 5) : 1,
              pageEnd = curPage + 4 < pageTotal ? (pageTotal < 10 ? pageTotal : (curPage > 6 ? curPage + 4 : 10)) : pageTotal;

            for (var i = pageStart; i <= pageEnd; i++) {
              $scope.pageList.push(i);
            }
          }
        });
      };

      $scope.httpList(1);
    }
  ]);
});
