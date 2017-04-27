define(['./controller'], function(controller) {
  'use strict';

  controller.controller('LoginCtrl', [
    '$scope', '$http',
    function($scope, $http) {
      $scope.email = '';
      $scope.password = '';

      $scope.login = function() {
        var inputs = document.querySelectorAll('input[ng-model]');

        for (var i = 0, len = inputs.length; i < len; i++) {
          angular.element(inputs[i]).controller('ngModel').$setViewValue(inputs[i].value);
        }
        $scope.conNul = false;

        if ($scope.email == '' || $scope.password == '') {
          $scope.msg = '帐号和密码不能为空';
          $scope.conNul = true;
          return;

        } else {

          $http({
            url: '/wlwx/login',
            method: 'POST',
            params: {
              loginname: $scope.email,
              password: $scope.password
            }
          }).success(function(response) {

            if (response.status == 1) {
              window.location.href = '/overview';

            } else if (response.status == -1) {
              $scope.msg = '账户或密码错误';
              $scope.conNul = true;
            }
          });
        }
      };

      var animation = function() {
        var object = document.getElementById('logo');

        var act = function() {
          object.className = 'bg logo-act';
        };

        var stop = function() {
          object.className = 'bg logo-stop';
        };

        return {
          run: act,
          stop: stop
        };
      }();

      var timer = null;

      var timerRun = function() {
        animation.stop();
        clearInterval(timer);

        timer = setTimeout(function() {
          animation.run();
        }, 3000);
      };

      var inputs = document.getElementsByTagName('input');

      for (var i = 0, len = inputs.length; i < len; i++) {

        inputs[i].onfocus = timerRun;
        inputs[i].onkeydown = timerRun;
      }

      timerRun();

      document.getElementsByTagName('html')[0].className = 'gray-bg';
    }
  ]);
});
