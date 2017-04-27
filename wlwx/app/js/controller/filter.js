define(['./controller'], function(controller) {
  'use strict';

  controller.controller('FilterCtrl', [
    '$scope', '$http',
    function($scope, $http) {
      $scope.title = '员工名单';
      $scope.curPage = 1;

      $scope.httpList = function(curPage) {
        $scope.curPage = curPage;

        $http({
          url: '/wlwx/filter',
          method: 'GET',
          params: {
            'page.currentPage': curPage
          }
        }).
        success(function(response) {
          var status = response.msg,
            data = response.data;

          if (status == 'success') {
            $scope.staffList = data;
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

      $scope.addMac = $scope.addName = $scope.addRemark = '';

      $scope.addStaff = function() {

        if ($scope.addMac == '') {
          alert('请输入MAC地址');
          return;
        }

        $http({
          url: '/wlwx/blackList/insert',
          method: 'POST',
          params: {
            mac: $scope.addMac,
            name: $scope.addName,
            remark: $scope.addRemark
          }
        }).
        success(function(response) {
          var status = response.msg;

          if (status == 'success') {
            $scope.showAdd = false;
            $scope.httpList($scope.curPage);
            $scope.addMac = '';
            $scope.addName = '';
            $scope.addRemark = '';
          }
        });
      }

      $scope.editStaff = function(num, id, mac, name, remark) {
        $scope.number = num;
        $scope.editId = id;
        $scope.editMac = mac;
        $scope.editName = name;
        $scope.editRemark = remark;
        $scope.showEdit = true;
      }

      $scope.saveStaff = function() {
        $http({
          url: '/wlwx/blackList/insert',
          method: 'POST',
          params: {
            id: $scope.editId,
            mac: $scope.editMac,
            name: $scope.editName,
            remark: $scope.editRemark
          }
        }).
        success(function(response) {
          var status = response.msg;

          if (status == 'success') {
            $scope.showEdit = false;
            $scope.httpList($scope.curPage);
          }
        });
      }

      $scope.showDeleteWrap = function(id) {
        $scope.delId = id;
        $scope.showDelete = true;
      }

      $scope.delStaff = function() {
        $http({
          url: '/wlwx/blackList/delete',
          method: 'GET',
          params: {
            id: $scope.delId
          }
        }).
        success(function(response) {
          var status = response.msg;

          if (status == 'success') {
            $scope.showDelete = false;

            if ($scope.staffList.length == 1) {
              $scope.curPage--;
            }
            $scope.httpList($scope.curPage);
          }
        });
      }

      $scope.httpList($scope.curPage);
    }
  ]);
});
