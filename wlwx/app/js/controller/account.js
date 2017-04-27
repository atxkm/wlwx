define(['./controller'], function(controller) {
  'use strict';

  controller.controller('AccountCtrl', [
    '$scope', '$http', '$session',
    function($scope, $http, $session) {
      $scope.title = '账户管理';
      var loginUser = $session.getItem('loginUser');
      $scope.company = loginUser.account.gsmc;
      $scope.email = loginUser.account.mail;
      $scope.username = loginUser.username;
      $scope.mobile = loginUser.account.lxdh;
      $scope.mobile = $scope.mobile == '' ? '未填写' : $scope.mobile;

      var loginname = loginUser.loginname;

      var httpAc = function(params, callBack) {
        $http({
          url: '/wlwx/user/changAc',
          method: 'GET',
          params: params
        }).
        success(function(response) {

          if (response.msg == 'success') {
            callBack();

          } else if (response.msg == 'error') {
            alert('保存失败，请重试');
          }
        });
      }

      $scope.saveAccount = function() {

        httpAc({
          loginName: loginname,
          username: $scope.usernameText,
          lxdh: $scope.mobile
        }, function() {
          $scope.username = $scope.usernameText;
          $scope.editName = false;
        });
      }

      $scope.saveMobile = function() {

        httpAc({
          loginName: loginname,
          username: $scope.username,
          lxdh: $scope.mobileText
        }, function() {
          $scope.mobile = $scope.mobileText;
          $scope.editMobile = false;
        });
      }

      $scope.oldPsw = $scope.newPsw = $scope.rePsw = '';
      $scope.changePsw = function() {

        if ($scope.oldPsw == '') {
          alert('请输入原密码');
          return;
        }

        if ($scope.newPsw == '') {
          alert('请输入新密码');
          return;
        }

        if ($scope.rePsw == '') {
          alert('请输入重复密码');
          return;
        }

        if ($scope.newPsw != $scope.rePsw) {
          alert('新密码与重复密码不一样');
          return;
        }

        $http({
          url: '/wlwx/user/change_password',
          method: 'POST',
          params: {
            loginName: loginname,
            newPwd: $scope.newPsw,
            oldPwd: $scope.oldPsw
          }
        }).
        success(function(response) {
          var status = response.msg;

          if (status == 'success') {
            $scope.showAlert = false;
            $scope.oldPsw = $scope.newPsw = $scope.rePsw = '';

          } else if (status == 'error') {
            alert('原密码不正确!');
          }
        });
      }
    }
  ]);
});
