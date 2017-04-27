define(['./controller'], function(controller) {
  'use strict';

  controller.controller('StoreCtrl', [
    '$scope', '$http',
    function($scope, $http) {
      $scope.title = '店铺管理';
      $scope.curPage = 1;

      var httpList = function(curPage) {
        $http({
          url: '/wlwx/store',
          method: 'GET',
          params: {
            'page.currentPage': curPage
          }
        }).
        success(function(response) {
          var status = response.status,
            data = response.data;

          if (status == 1) {
            $scope.storeList = data;
            $scope.pageTotal = parseInt((response.count - 1) / 10) + 1;
            $scope.pageList = [];

            var curPage = $scope.curPage,
              pageTotal = $scope.pageTotal,
              pageStart = curPage > 5 ? (curPage + 4 > pageTotal && pageTotal > 10 ? pageTotal - 9 : curPage - 5) : 1,
              pageEnd = curPage + 4 < pageTotal ? (pageTotal < 10 ? pageTotal : (curPage > 6 ? curPage + 4 : 10)) : pageTotal;

            for (var i = pageStart; i <= pageEnd; i++) {
              $scope.pageList.push(i);
            }

          } else if (status == -1) {
            window.location.href = '/';
          }
        });
      }

      $scope.showAlert = function(storeId, dpmc, address) {
        $scope.showEditWrap = true;
        $scope.storeId = storeId;
        $scope.dpmc = dpmc;
        $scope.address = address;
      }

      $scope.updateStore = function() {
        $http({
          url: '/wlwx/updateStore',
          method: 'POST',
          params: {
            id: $scope.storeId,
            dpmc: $scope.dpmc,
            address: $scope.address
          }
        }).
        success(function(response) {
          var status = response.status,
            data = response.data;

          if (status == 1) {
            $scope.storeList = data;
            httpList(curPage);
            showEditWrap = true;

          } else if (status == -1) {
            window.location.href = '/';
          }
        });
      }

      httpList($scope.curPage);
    }
  ]);
});
